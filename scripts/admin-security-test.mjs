import assert from 'node:assert/strict';
import {
  normalizeRole, canWritePath, canDraftPath, canUploadImage,
  hasValidImageSignature, canViewDraft, listDrafts,
} from '../worker/lib.js';

const admin = { username: 'admin', role: 'admin' };
const author = { username: 'author', role: 'author' };
const contributor = { username: 'contributor', role: 'contributor' };

assert.equal(normalizeRole(undefined), 'admin', 'legacy users retain their pre-RBAC admin capability');
assert.equal(normalizeRole('invalid'), 'author', 'invalid explicit roles fail closed');
assert.equal(canWritePath(admin, 'robots.txt'), true);
assert.equal(canWritePath(author, 'valid-article.html'), true);
for (const path of ['robots.txt', '_headers', 'article.html', 'game-detail.html', 'en/manga-detail.html', 'assets/app.js']) {
  assert.equal(canWritePath(author, path), false, `author must not write ${path}`);
}
assert.equal(canDraftPath(contributor, 'my-draft.html'), true);
assert.equal(canDraftPath(contributor, 'index.html'), false);
assert.equal(canUploadImage(author, 'assets/img/uploads/abc123-photo.png'), true);
assert.equal(canUploadImage(author, 'assets/img/uploads/abc123-photo.svg'), false);
assert.equal(canUploadImage(contributor, 'assets/img/uploads/abc123-photo.png'), false);

const authorDraft = { file: 'a.html', updatedBy: 'author' };
assert.equal(canViewDraft(author, authorDraft), true);
assert.equal(canViewDraft(contributor, authorDraft), false);
assert.equal(canViewDraft(admin, authorDraft), true);

const draftValues = new Map([
  ['draft:a.html', JSON.stringify({ file: 'a.html', updatedBy: 'author', updatedAt: 2 })],
  ['draft:b.html', JSON.stringify({ file: 'b.html', updatedBy: 'someone-else', updatedAt: 1 })],
]);
const mockEnv = { ADMIN_KV: {
  list: async () => ({ keys: [...draftValues.keys()].map((name) => ({ name })) }),
  get: async (key) => draftValues.get(key) ?? null,
} };
assert.deepEqual((await listDrafts(mockEnv, author)).map((draft) => draft.file), ['a.html']);
assert.deepEqual((await listDrafts(mockEnv, admin)).map((draft) => draft.file), ['a.html', 'b.html']);

const b64 = (bytes) => Buffer.from(bytes).toString('base64');
assert.equal(hasValidImageSignature('assets/img/uploads/abc123-photo.png', b64([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a])), true);
assert.equal(hasValidImageSignature('assets/img/uploads/abc123-photo.jpg', b64([0xff,0xd8,0xff,0xe0])), true);
assert.equal(hasValidImageSignature('assets/img/uploads/abc123-photo.png', b64(Buffer.from('<script>alert(1)</script>'))), false);

console.log('admin security tests: ok');
