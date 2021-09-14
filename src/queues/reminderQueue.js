const { reminderQueue } = require('../config/bull');
const fcm = require('../utils/fcm');
const { fcmTypes } = require('../config/fcm');

const lessonQueueName = 'lesson';

// reminder producer
const addReminderQueue = (role, registrationIds, title, body, { data = {}, opts = {} } = {}) => {
  reminderQueue.add(lessonQueueName, {
    registrationIds,
    title,
    body,
    data,
    role,
  }, { ...opts });
};

const initializeReminderQueue = () => {
  // reminder consumer
  reminderQueue.process(lessonQueueName, (job, done) => {
    const {
      registrationIds, title, body, data, role,
    } = job.data;
    if (role === fcmTypes.TEACHER) {
      fcm.sendNotificationTeacher(registrationIds, title, body, { data });
    } else {
      fcm.sendNotificationStudent(registrationIds, title, body, { data });
    }
    done();
  });
};

module.exports = {
  initializeReminderQueue,
  addReminderQueue,
};
