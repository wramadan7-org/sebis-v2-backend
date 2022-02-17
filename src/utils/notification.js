require('dotenv').config();

const { SECRET_FCM_STUDENT } = process.env;
const FCM = require('fcm-node');

const fcm = new FCM(SECRET_FCM_STUDENT);

const notification = (regisToken, titleMessage, bodyMessage) => {
  try {
    const message = {
      registration_ids: regisToken,

      notification: {
        title: titleMessage,
        body: bodyMessage,
        android_channel_id: 'custom-channel-id',
        sound: 'sebissound.mp3',
      },

      data: {
        my_key: 'myValue',
        my_another_key: 'my another value',
      },
    };
    // console.log('message', message)

    fcm.send(message, (err, response) => {
      if (err) {
        // console.log('Something has gone wrong!', err)
      } else {
        // console.log('Successfully sent it with response', response)
      }
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = notification;
