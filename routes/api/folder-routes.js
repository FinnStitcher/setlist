const router = require('express').Router();

// /api/folder

const {
    getAllFolders,
    getOneFolder,
    postFolder,
    editFolder,
    deleteFolder
} = require('../../controllers/folder-controller');

router.route('/').get(getAllFolders).post(postFolder);
router.route('/:id').get(getOneFolder).put(editFolder).delete(deleteFolder);

module.exports = router;