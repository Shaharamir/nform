module.exports = {
  name: 'nform-demo-app',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/nform-demo-app',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
