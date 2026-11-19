import test from 'node:test';
import assert from 'node:assert/strict';
import { detectCodec } from '../src/providers/monochrome.js';

const mp4 = (codecBox: string) => `\0\0\0\x1cftypiso6\0\0\0\0moov....stsd....${codecBox}....`;

test('labels FLAC-in-MP4 as lossless', () => {
  assert.deepEqual(detectCodec(mp4('fLaC....dfLa')), { format: 'flac', codec: 'flac', container: 'mp4', quality: 'LOSSLESS' });
});

test('labels a raw FLAC file as lossless', () => {
  assert.equal(detectCodec('fLaC\0\0\0\x22').container, 'flac');
  assert.equal(detectCodec('fLaC\0\0\0\x22').quality, 'LOSSLESS');
});

test('labels ALAC as lossless', () => {
  assert.equal(detectCodec(mp4('alac')).format, 'alac');
});

test('labels AAC as HIGH, not FLAC', () => {
  assert.deepEqual(detectCodec(mp4('mp4a....esds')), { format: 'aac', codec: 'aac', container: 'mp4', quality: 'HIGH' });
});

test('makes no claim when the codec is unknown', () => {
  assert.deepEqual(detectCodec('{"error":"rate limited"}'), {});
});
