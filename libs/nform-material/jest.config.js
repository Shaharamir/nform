module.exports = {
  name: 'nform-material',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/nform-material',
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
