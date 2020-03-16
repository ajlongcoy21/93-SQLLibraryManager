'use strict';
const Sequelize = require('sequelize');

// create book class for sequelize

module.exports = (sequelize) => 
{
    class Book extends Sequelize.Model {}
    /*
    Book has the following information
    TITLE - string - has validation
    AUTHOR - string - has validation
    GENRE - string
    YEAR - integer
    CreatedAT - date
    UpdatedAT - date
    */
   
    Book.init({
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Please provide a value for "title"' },
          notEmpty: { msg: 'Please provide a value for "title"' }
        }
      },
      author: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Please provide a value for "author"' },
          notEmpty: { msg: 'Please provide a value for "author"' }
        }
      },
      genre: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: { }
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: { }
      },
      createdAt:
      {
        type: Sequelize.DATEONLY,
        allowNull: true,
        validate: { }
      },
      updatedAt:
      {
        type: Sequelize.DATEONLY,
        allowNull: true,
        validate: { }
      }
    }, { sequelize });
  
    return Book;
};