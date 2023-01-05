'use strict';
const IMAGE_ISEKAI = 'https://bit.ly/3C6cBKL';
const IMAGE_FANTASY = 'https://bit.ly/3G1CvAQ';
const IMAGE_SLICE = 'https://bit.ly/3Z0BSjm';
module.exports = {
  up: async (queryInterface, Sequelize) => {

    //Add seed commands here.
    await queryInterface.bulkInsert('Product', [
      {
        "title": "Isekai",
        "subtitle": "We have isekai hot novel",
        "image_url": IMAGE_ISEKAI,
        "payload": "VIEW_NOVEL",
      },
      {
        "title": "Fantasy",
        "subtitle": "We have fantasy novel",
        "image_url": IMAGE_FANTASY,
        "payload": "VIEW_FANTASY",
      },
      {
        "title": "Slice of Slice",
        "subtitle": "We have a lot of slice of slice novel",
        "image_url": IMAGE_SLICE,
        "payload": "VIEW_SLICEOFSLICE",
      },
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
