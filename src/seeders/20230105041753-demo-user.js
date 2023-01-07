'use strict';
const IMAGE_ISEKAI = 'https://bit.ly/3C6cBKL';
const IMAGE_FANTASY = 'https://bit.ly/3G1CvAQ';
const IMAGE_SLICE = 'https://bit.ly/3Z0BSjm';
const IMAGE_DORAEMON = 'https://bit.ly/3Q1nQKh';
const IMAGE_FAIRYTAIL = 'https://bit.ly/3voxi0P';
const IMAGE_ONEPIECE = 'https://bit.ly/3VwPHn0';
module.exports = {
  up: async (queryInterface, Sequelize) => {

    //Add seed commands here.
    await queryInterface.bulkInsert('Product', [
      {
        "title": "Isekai",
        "subtitle": "We have isekai hot novel",
        "image_url": IMAGE_ISEKAI,
        "payload": "VIEW_NOVEL",
        "type": "NOVEL",
      },
      {
        "title": "Fantasy",
        "subtitle": "We have fantasy novel",
        "image_url": IMAGE_FANTASY,
        "payload": "VIEW_FANTASY",
        "type": "NOVEL",
      },
      {
        "title": "Slice of Slice",
        "subtitle": "We have a lot of slice of slice novel",
        "image_url": IMAGE_SLICE,
        "payload": "VIEW_SLICEOFSLICE",
        "type": "NOVEL",
      },
      {
        "title": "Doraemon",
        "subtitle": "We have list of doraemon manga",
        "image_url": IMAGE_DORAEMON,
        "payload": "VIEW_DORAEMON",
        "type": "MANGA",
      },
      {
        "title": "Fairy tails",
        "subtitle": "We have manga Fairy tails",
        "image_url": IMAGE_FAIRYTAIL,
        "payload": "VIEW_FAIRYTAIL",
        "type": "MANGA",
      },
      {
        "title": "One piece",
        "subtitle": "We have One piece manga",
        "image_url": IMAGE_ONEPIECE,
        "payload": "VIEW_ONEPIECE",
        "type": "MANGA",
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
