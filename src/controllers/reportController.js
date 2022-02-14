const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const paginate = require('../utils/pagination');
const days = require('../utils/day');
const dates = require('../utils/date');

const { User } = require('../models/User');
const { Schedule } = require('../models/Schedule');
const { AvailabilityHours } = require('../models/AvailabilityHours');
const { TeacherSubject } = require('../models/TeacherSubject');
const { Subject } = require('../models/Subject');
const { Grade } = require('../models/Grade');
const { GradeGroup } = require('../models/GradeGroup');
const { Curriculum } = require('../models/Curriculum');
const { Report } = require('../models/Reports');

const reportService = require('../services/reportService');
const scheduleService = require('../services/scheduleService');

const getOwnListReport = catchAsync(async (req, res) => {
  const { id } = req.user;
  let { page, limit } = req.query;

  if (page) {
    page = parseInt(page);
  } else {
    page = 1;
  }

  if (limit) {
    limit = parseInt(limit);
  } else {
    limit = 10;
  }

  const listSchedule = await scheduleService.historySchedule(
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
          ],
        },
        {
          model: Report,
        },
      ],
    },
  );

  if (!listSchedule || listSchedule.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'Belum ada les yang selesai.');

  const mapListSchedule = listSchedule.map((o) => {
    let status;
    let reportId;

    if (o.reports.length <= 0) {
      status = 'Tutor belum mengisi Report';
    } else {
      status = 'Lihat Report Siswa.';
      const ownReport = o.reports.filter((filtering) => filtering.userId == id);
      reportId = ownReport[0].id;
    }

    const data = {
      reportId: reportId ? reportId : null,
      scheduleId: o.id,
      teacherSubjectId: o.teacherSubjectId,
      subjectId: o.teacherSubject.subjectId,
      les: `Les ${o.teacherSubject.subject.subjectName}`,
      profile: o.teacher.profile,
      status,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    };

    return data;
  });

  const sorting = mapListSchedule.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const pagination = paginate(sorting, page, limit);

  res.sendWrapped(null, httpStatus.OK, pagination);
});

const getReportDetail = catchAsync(async (req, res) => {
  const { id } = req.params;

  const report = await reportService.getReportById(
    id,
    {
      include: [
        {
          model: Schedule,
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
                  include: {
                    model: GradeGroup,
                    include: {
                      model: Curriculum,
                    },
                  },
                },
              ],
            },
            {
              model: AvailabilityHours,
            },
          ],
        },
      ],
    },
  );

  if (!report) throw new ApiError(httpStatus.NOT_FOUND, 'Report tidak ditemukan.');

  const convertDay = days(report.schedule.availabilityHour.dayCode);
  const convertDate = dates(report.schedule.dateSchedule);

  const dataTutor = {
    profile: report.schedule.teacher.profile,
    name: `${report.schedule.teacher.firstName} ${report.schedule.teacher.lastName}`,
    aboutTeacher: `${report.schedule.teacherSubject.subject.subjectName} - ${report.schedule.teacherSubject.grade.gradeGroup.curriculum.curriculumName} - ${report.schedule.teacherSubject.grade.gradeGroup.gradeGroupName} - Kelas ${report.schedule.teacherSubject.grade.gradeCode}`,
  };

  const dataLes = {
    date: `${convertDay}, ${convertDate} | ${report.schedule.availabilityHour.timeStart} - ${report.schedule.availabilityHour.timeEnd}`,
    subject: `${report.schedule.teacherSubject.subject.subjectName} - ${report.schedule.teacherSubject.grade.gradeGroup.gradeGroupName} - Kelas ${report.schedule.teacherSubject.grade.gradeCode}`,
    typeClass: report.schedule.typeClass,
    material: report.schedule.requestMaterial,
    materialImage: report.schedule.imageMaterial,
  };

  const dataReport = {
    presence: report.presence ? parseInt(report.presence) : null,
    connection: report.connection ? parseInt(report.connection) : null,
    understand: report.understand ? parseInt(report.understand) : null,
    master: report.master ? parseInt(report.master) : null,
    complete: report.complete ? parseInt(report.complete) : null,
    conclude: report.conclude ? parseInt(report.conclude) : null,
    conclusion: report.conclusion ? report.conclusion : null,
    internetAppProblem: report.internetAppProblem ? report.internetAppProblem : null,
    mediaAndLearningResources: report.mediaAndLearningResources ? report.mediaAndLearningResources : null,
    etc: report.etc ? report.etc : null,
    isReported: report.isReported ? report.isReported : null,
  };

  const dataResult = {
    reportId: report.id,
    scheduleId: report.schedule.id,
    teacherId: report.schedule.teacherId,
    availabilityHoursId: report.schedule.availabilityHoursId,
    teacherSubjectId: report.schedule.teacherSubjectId,
    subjectId: report.schedule.teacherSubject.subjectId,
    gradeId: report.schedule.teacherSubject.gradeId,
    gradeGroupId: report.schedule.teacherSubject.grade.gradeGroupId,
    curriculumId: report.schedule.teacherSubject.grade.gradeGroup.curriculumId,
    teacher: dataTutor,
    les: dataLes,
    report: dataReport,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
  };

  res.sendWrapped(dataResult, httpStatus.OK);
});

const updateReport = catchAsync(async (req, res) => {
  const { id } = req.params;
  const reportBody = req.body;

  const report = await reportService.getReportById(id);

  if (!report) throw new ApiError(httpStatus.NOT_FOUND, 'Report tidak ditemukan.');

  const data = {
    presence: reportBody.presence ? reportBody.presence.toString() : report.presence.toString(),
    connection: reportBody.connection ? reportBody.connection.toString() : report.connection.toString(),
    understand: reportBody.understand ? reportBody.understand.toString() : report.understand.toString(),
    master: reportBody.master ? reportBody.master.toString() : report.master.toString(),
    complete: reportBody.complete ? reportBody.complete.toString() : report.complete.toString(),
    conclude: reportBody.conclude ? reportBody.conclude.toString() : report.conclude.toString(),
    ...report,
  };

  Object.assign(reportBody, data);

  const update = await reportService.updateReport(id, report, reportBody);

  if (!update) throw new ApiError(httpStatus.CONFLICT, 'Gagal memperbarui data report.');

  const result = {
    presence: parseInt(update.dataValues.presence),
    connection: parseInt(update.dataValues.connection),
    understand: parseInt(update.dataValues.understand),
    master: parseInt(update.dataValues.master),
    complete: parseInt(update.dataValues.complete),
    conclude: parseInt(update.dataValues.conclude),
  };

  Object.assign(update, result);

  res.sendWrapped(update, httpStatus.OK);
});

module.exports = {
  getOwnListReport,
  getReportDetail,
  updateReport,
};
