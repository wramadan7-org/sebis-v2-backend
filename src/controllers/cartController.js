const httpStatus = require('http-status');
const moment = require('moment');
const catchAsync = require('../utils/catchAsync');
const { Cart } = require('../models/Cart');
const { CartItem } = require('../models/CartItem');
const { User } = require('../models/User');
const { Role } = require('../models/Role');
const { TeacherSubject } = require('../models/TeacherSubject');
const { AvailabilityHours } = require('../models/AvailabilityHours');
const { Price } = require('../models/Price');
const { Subject } = require('../models/Subject');
const { Grade } = require('../models/Grade');
const { UserDetail } = require('../models/UserDetail');
const ApiError = require('../utils/ApiError');
const days = require('../utils/day');
const dates = require('../utils/date');
const pagination = require('../utils/pagination');
const multering = require('../utils/multer');
const resizing = require('../utils/resizeImage');

const cartService = require('../services/cartService');
const scheduleService = require('../services/scheduleService');
const userService = require('../services/userService');

const {
  PENDING, ACCEPT, PROCESS, REJECT, CANCEL, EXPIRE, DONE, OFFSET_ORDER_HOURS,
} = process.env;

// teacher
const getOrderList = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  const { cartItemStatus } = req.query;

  const cartItems = await cartService.orderList(
    teacherId,
    cartItemStatus,
    {
      include: [
        {
          model: Cart,
          include: [
            {
              model: User,
              as: 'student',
            },
          ],
        },
        {
          model: User,
          as: 'teacher',
        },
      ],
    },
  );

  if (!cartItems || cartItems.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'List order kosong.');

  res.sendWrapped(cartItems, httpStatus.OK);
});

const approvingOrder = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  const { cartItemId } = req.params;
  const { cartItemStatus } = req.body;

  const cartItem = await cartService.approvingCartRequest(
    cartItemId,
    teacherId,
    cartItemStatus,
  );

  res.sendWrapped(cartItem, httpStatus.OK);
});

// student
const addCart = catchAsync(async (req, res) => {
  const studentId = req.user.id;
  const {
    teacherId,
    typeCourse,
    startTime,
    endTime,
    teacherSubjectId,
    availabilityHoursId,
  } = req.body;

  // Pengecekan jam untuk melakukan pemesanan les
  const currentHour = parseInt(moment().format('H'));
  if (currentHour >= 22 || currentHour <= 5) throw new ApiError(httpStatus.BAD_REQUEST, 'Batas jam pemesanan les hanya pukul 06:00 WIB - 21:59 WIB!');

  const createCart = await cartService.findOrCreateCart(studentId, teacherId);

  if (!createCart) throw new ApiError(httpStatus.BAD_REQUEST, 'Gagal membuat cart');

  const cartItemData = {
    cartItemStatus: 'pending',
    typeCourse,
    startTime: moment(startTime).format('YYYY-MM-DD HH:mm'),
    endTime: moment(endTime).format('YYYY-MM-DD HH:mm'),
    cartId: createCart[0].id,
    teacherSubjectId,
    availabilityHoursId,
  };

  // Cek apakah jam sekarang berseilih lebih dari 2 jam dari jadwal les
  const offsetHours = parseInt(OFFSET_ORDER_HOURS);
  const checkBetweenHours = await cartService.checkBetweenHours(cartItemData.startTime, offsetHours);

  if (!checkBetweenHours) throw new ApiError(httpStatus.CONFLICT, `Jam kursus hanya bisa diatas ${offsetHours} Jam dari sekarang`);

  // Ambil semua data keranjang milik kita sendiri
  const ownCart = await cartService.getCartByStudentId(studentId);

  if (!ownCart && ownCart.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'Anda belum memiliki keranjang.');

  const mapCartId = ownCart.map((o) => o.id);

  // Cek cart sudah ada atau belum
  const checkCartItem = await cartService.checkerCartItem(
    teacherSubjectId,
    moment(startTime).format('YYYY-MM-DD HH:mm:ss'),
    mapCartId,
  );

  // Jika hasil dari pengecekan true(cart sudah ada), maka tampilkan error
  if (checkCartItem) throw new ApiError(httpStatus.CONFLICT, `Sudah ada yang membeli jadwal di jam dan tanggal ini ${moment(startTime).format('YYYY-MM-DD HH:mm:ss')}`);

  // Cek apakah sudah memiliki les di tanggal dan jam yang sama
  const checkSchedule = await scheduleService.checkAvailDateSchedule(studentId, moment(startTime).format('YYYY-MM-DD'), availabilityHoursId);

  // Jika ada maka response true dan mengirim pesan error
  if (checkSchedule) throw new ApiError(httpStatus.CONFLICT, 'Anda sudah memiliki jadwal les di jam dan tanggal ini.');

  // Buat item cart
  const createCartItem = await cartService.createCartItem(
    teacherId,
    cartItemData,
  );

  if (!createCartItem) throw new ApiError(httpStatus.BAD_REQUEST, 'Gagal menambah item');

  res.sendWrapped({ createCart, createCartItem }, httpStatus.OK);
});

const viewCart = catchAsync(async (req, res) => {
  let { page, limit } = req.query;
  const studentId = req.user.id;

  if (page) {
    parseInt(page);
  } else {
    page = 1;
  }

  if (limit) {
    parseInt(limit);
  } else {
    limit = 10;
  }

  const cart = await cartService.getCartByStudentId(studentId, {
    include: [
      {
        model: User,
        as: 'student',
        attributes: {
          exclude: ['password'],
        },
        include: {
          model: Role,
          attributes: ['roleName'],
        },
      },
      {
        model: User,
        as: 'teacher',
        attributes: {
          exclude: ['password'],
        },
        include: {
          model: Role,
          attributes: ['roleName'],
        },
        include: {
          model: UserDetail,
          include: {
            model: Price,
          },
        },
      },
      {
        model: CartItem,
        include: [
          {
            model: TeacherSubject,
            include: [
              {
                model: Subject,
              },
              {
                model: Grade,
              },
            ],
          },
          {
            model: AvailabilityHours,
          },
          {
            model: User,
            attributes: {
              exclude: ['password'],
            },
            as: 'firstFriend',
            include: {
              model: Role,
              attributes: ['roleName'],
            },
          },
          {
            model: User,
            as: 'secondFriend',
            attributes: {
              exclude: ['password'],
            },
          },
        ],
      },
    ],
  });

  // Ambil data original
  const originalData = JSON.stringify(cart);
  // Kemudian parsing ke JSON untuk pendefinisian
  const convertData = JSON.parse(originalData);

  console.log(convertData);

  let privatePrice = 0;
  let groupPrice = 0;
  let total = 0;

  if (convertData.teacher && convertData.teacher.userDetail && convertData.teacher.userDetail.price) {
    privatePrice = convertData.teacher.userDetail.price.private;
    groupPrice = convertData.teacher.userDetail.price.group;
  } else {
    const defaultPrice = await Price.findOne(
      {
        where: {
          type: 'A',
        },
      },
    );

    privatePrice = defaultPrice.private;
    groupPrice = defaultPrice.group;
  }

  const mapingData = convertData.map((o) => {
    const arrayResults = [];
    const item = o.cartItems.map((itm) => {
      const convertDay = itm.availabilityHour ? days(itm.availabilityHour.dayCode) : days(moment(itm.startTime).day());
      const convertDate = itm.startTime ? dates(itm.startTime) : null;

      const dataCartItem = {
        cartItemId: itm.id,
        teacherId: itm.teacherId,
        teacherSubjectId: itm.teacherSubjectId,
        availabilityHoursId: itm.availabilityHoursId,
        gradeId: itm.teacherSubject.gradeId,
        subjectId: itm.teacherSubject.subjectId,
        type: itm.typeCourse,
        subject: itm.teacherSubject.subject.subjectName,
        grade: itm.teacherSubject.grade.gradeName,
        date: `${convertDay}, ${convertDate}`,
        time: `${moment(itm.startTime).format('HH:mm')} - ${moment(itm.endTime).format('HH:mm')}`,
        status: itm.cartItemStatus,
        price: itm.typeCourse == 'private' ? privatePrice : groupPrice,
        requestMaterial: itm.requestMaterial ? itm.requestMaterial : null,
        imageMaterial: itm.imageMaterial ? itm.imageMaterial : null,
        createdAt: itm.createdAt,
        updatedAt: itm.updatedAt,
        friend1: itm.firstFriend,
        friend2: itm.secondFriend,
      };

      total += dataCartItem.price;

      return arrayResults.push(dataCartItem);
    });

    // Sorting item cart
    const sortingItem = arrayResults.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const data = {
      cartId: o.id,
      studentId: o.studentId,
      teacherId: o.teacherId,
      student: `${o.student.firstName} ${o.student.lastName}`,
      teacher: `${o.teacher.firstName} ${o.teacher.lastName}`,
      profile: o.student.profile,
      referralCode: o.student.referralCode,
      referredBy: o.student.referredBy,
      cartItems: sortingItem,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    };

    return data;
  });

  // Filter untuk menampikan data yang memiliki item wishlist
  const filteringItem = mapingData.filter((o) => o.cartItems.length > 0);
  // Sorting parent cart
  const sorting = filteringItem.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const paginateData = pagination(sorting, page, limit);
  const concatData = {
    ...paginateData,
    total,
  };

  res.sendWrapped('', httpStatus.OK, concatData);

  /**
  // Ambil data original
  const originalData = JSON.stringify(cart[0]);
  // Kemudian parsing ke JSON untuk pendefinisian
  const convertData = JSON.parse(originalData);

  let arrayCartItems = [];

  // Looping untuk mengganti formating tanggal les
  if (convertData.cartItems && convertData.cartItems.length > 0) {
    for (const loopCartItems of convertData.cartItems) {
      const convertDay = loopCartItems.availabilityHour ? days(loopCartItems.availabilityHour.dayCode) : days(moment(loopCartItems.startTime).day());
      const convertDate = loopCartItems.startTime ? dates(loopCartItems.startTime) : null;
      const dataCartItem = {
        cartItemId: loopCartItems.id,
        teacherId: loopCartItems.teacherId,
        teacherSubjectId: loopCartItems.teacherSubjectId,
        availabilityHoursId: loopCartItems.availabilityHoursId,
        gradeId: loopCartItems.teacherSubject.gradeId,
        subjectId: loopCartItems.teacherSubject.subjectId,
        teacher: `${loopCartItems.teacher.firstName} ${loopCartItems.teacher.lastName}`,
        type: loopCartItems.teacherSubject.type,
        subject: loopCartItems.teacherSubject.subject.subjectName,
        grade: loopCartItems.teacherSubject.grade.gradeName,
        date: `${convertDay}, ${convertDate}`,
        time: `${moment(loopCartItems.startTime).format('HH:mm')} - ${moment(loopCartItems.endTime).format('HH:mm')}`,
      };
      arrayCartItems.push(dataCartItem);
    }
  }

  // Ambil data original kemudian ganti key cartItems menjadi arrayCartItems
  convertData.cartItems = arrayCartItems;

  const data = {
    cartId: convertData.id,
    studentId: convertData.studentId,
    student: `${convertData.student.firstName} ${convertData.lastName}`,
    profile: convertData.student.profile,
    referralCode: convertData.student.referralCode,
    referredBy: convertData.student.referredBy,
    cartItems: arrayCartItems,
  };

  const mapToDistinct = new Map();

  arrayCartItems.forEach((item) => mapToDistinct.set(item.teacherId, { ...mapToDistinct.get(item.teacherId), ...item }));

  const results = Array.from(mapToDistinct.values());
*/
});

const getCartById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const cartItem = await cartService.getCartItemById(
    id,
    {
      include: [
        {
          model: User,
          as: 'teacher',
        },
        {
          model: TeacherSubject,
          include: [
            {
              model: Subject,
            },
            {
              model: Grade,
            },
          ],
        },
        {
          model: AvailabilityHours,
        },
        {
          model: Cart,
          include: {
            model: User,
            as: 'student',
          },
        },
      ],
    },
  );

  let privatePrice = 0;
  let groupPrice = 0;

  if (cartItem.teacher && cartItem.teacher.userDetail && cartItem.teacher.userDetail.price) {
    privatePrice = cartItem.teacher.userDetail.price.private;
    groupPrice = cartItem.teacher.userDetail.price.group;
  } else {
    const defaultPrice = await Price.findOne(
      {
        where: {
          type: 'A',
        },
      },
    );

    privatePrice = defaultPrice.private;
    groupPrice = defaultPrice.group;
  }

  const convertDay = cartItem.availabilityHour ? days(cartItem.availabilityHour.dayCode) : days(moment(cartItem.startTime).day());
  const convertDate = cartItem.startTime ? dates(cartItem.startTime) : null;

  const data = {
    cartItemId: cartItem.id,
    teacherId: cartItem.teacherId,
    studentId: cartItem.cart.student.id,
    teacherSubjectId: cartItem.teacherSubjectId,
    availabilityHoursId: cartItem.availabilityHoursId,
    gradeId: cartItem.teacherSubject.gradeId,
    subjectId: cartItem.teacherSubject.subjectId,
    student: `${cartItem.cart.student.firstName} ${cartItem.cart.student.lastName}`,
    teacher: `${cartItem.teacher.firstName} ${cartItem.teacher.lastName}`,
    type: cartItem.typeCourse,
    subject: cartItem.teacherSubject.subject.subjectName,
    grade: cartItem.teacherSubject.grade.gradeName,
    date: `${convertDay}, ${convertDate}`,
    time: `${moment(cartItem.startTime).format('HH:mm')} - ${moment(cartItem.endTime).format('HH:mm')}`,
    status: cartItem.cartItemStatus,
    price: cartItem.typeCourse == 'private' ? privatePrice : groupPrice,
    requestMaterial: cartItem.requestMaterial ? cartItem.requestMaterial : null,
    imageMaterial: cartItem.imageMaterial ? cartItem.imageMaterial : null,
    createdAt: cartItem.createdAt,
    updatedAt: cartItem.updatedAt,
  };

  res.sendWrapped(data, httpStatus.OK);
});

const updateStatusCart = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { cartItemStatus } = req.body;

  const cartItem = await cartService.updateCart(id, cartItemStatus);

  res.sendWrapped(cartItem, httpStatus.OK);
});

const updateRequestMateri = catchAsync(async (req, res) => {
  const { id } = req.params;
  const destination = 'images/material';

  const conditionStatus = [PENDING, ACCEPT, PROCESS];

  const checkCartItem = await cartService.getCartItemById(id);

  if (checkCartItem.cartItemStatus !== conditionStatus.some((value) => checkCartItem.cartItemStatus.includes(value))) {
    throw new ApiError(httpStatus.NOT_FOUND, `Hanya dapat request materi pada keranjang yang berstatus ${PENDING}, ${ACCEPT}, ${PROCESS}`);
  }

  multering.options('./', id).single('fileMaterial')(req, res, async (err) => {
    if (err) {
      res.sendWrapped(err);
    } else {
      if (!req.file.filename) {
        return res.sendWrapped('Please insert file/photo!', httpStatus.BAD_REQUEST);
      }

      const {
        requestMaterial, email1, email2, phone1, phone2,
      } = req.body;

      let arrayFriend = [];

      const updateMaterial = await cartService.updateRequestMateri(id, `static/${destination}/${req.file.filename}`, requestMaterial);

      await resizing(req.file.path, 200, 200, 90, `./public/${destination}/${req.file.filename}`);

      const group = [
        {
          email: email1,
          phone: phone1,
        },
        {
          email: email2,
          phone: phone2,
        },
      ];

      if (checkCartItem.typeCourse == 'group') {
        const filtering = group.filter((o) => o.email !== '' && o.phone !== '');

        if (filtering.length > 0) {
          if (filtering.length == 1) {
            const user = await userService.getUserByEmail(filtering[0].email);

            if (!user) {
              return res.sendWrapped(`${filtering[0].email} belum terdaftar di aplikasi. Yuk ajak temanmu untuk register di SEBISLES!`, httpStatus.NOT_FOUND);
            }
            const updateFriend = await CartItem.update(
              {
                friend1: user.id,
              },
              {
                where: {
                  id,
                },
              },
            );

            console.log('have data and update friend', updateFriend);
          } else if (filtering.length == 2) {
            const user1 = await userService.getUserByEmail(filtering[0].email);
            const user2 = await userService.getUserByEmail(filtering[1].email);

            if (!user1) {
              arrayFriend.push(filtering[0].email);
              // return res.sendWrapped(`${filtering[0].email} belum terdaftar di aplikasi. Yuk ajak temanmu untuk register di SEBISLES!`, httpStatus.NOT_FOUND);
            } else {
              const updateFriend1 = await CartItem.update(
                {
                  friend1: user1.id,
                },
                {
                  where: {
                    id,
                  },
                },
              );

              console.log('have data and update friend 1', updateFriend1);
            }

            // USER 2
            if (!user2) {
              arrayFriend.push(filtering[1].email);
              // return res.sendWrapped(`${filtering[1].email} belum terdaftar di aplikasi. Yuk ajak temanmu untuk register di SEBISLES!`, httpStatus.NOT_FOUND);
            } else {
              const updateFriend2 = await CartItem.update(
                {
                  friend2: user2.id,
                },
                {
                  where: {
                    id,
                  },
                },
              );

              console.log('user ada, update friend 2', updateFriend2);
            }
          }
        }

        if (arrayFriend.length == 2) {
          return res.sendWrapped(`${arrayFriend[0]} dan ${arrayFriend[1]} belum terdaftar di aplikasi. Yuk ajak temanmu untuk register di SEBISLES`, httpStatus.NOT_FOUND);
        }

        if (arrayFriend.length == 1) {
          return res.sendWrapped(`${arrayFriend[0]} belum terdaftar di aplikasi. Yuk ajak temanmu untuk register di SEBISLES`, httpStatus.NOT_FOUND);
        }
      } else {
        return res.sendWrapped('Menambahkan teman hanya dapat dilakukan pada keranjang yang memiliki tipe group', httpStatus.CONFLICT);
      }

      res.sendWrapped(updateMaterial, httpStatus.OK);
    }
  });
});

const deleteCartItem = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const cartItem = await cartService.deleteCartItem(id);

  res.sendWrapped(cartItem, httpStatus.OK);
});

module.exports = {
  getOrderList,
  addCart,
  approvingOrder,
  viewCart,
  getCartById,
  updateStatusCart,
  updateRequestMateri,
  deleteCartItem,
};
