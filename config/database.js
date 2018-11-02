//
// exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://localhost/musicianship';
'use strict';
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/musicianship';
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-musicianship';

module.exports = {
    DATABASE_URL,
    TEST_DATABASE_URL
};
