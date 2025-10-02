const express = require('express');
const router = express.Router();
const Role = require('../schemas/role');

router.post('/', async (req, res) => {
    try {
        const role = new Role(req.body);
        await role.save();
        res.status(201).json(role);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    const { name } = req.query;
    const query = { isDelete: false };
    if (name) query.name = { $regex: name, $options: 'i' };
    const roles = await Role.find(query);
    res.json(roles);
});

router.get('/:id', async (req, res) => {
    const role = await Role.findOne({ _id: req.params.id, isDelete: false });
    if (!role) return res.status(404).json({ error: 'Not found' });
    res.json(role);
});

router.put('/:id', async (req, res) => {
    try {
        const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(role);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    await Role.findByIdAndUpdate(req.params.id, { isDelete: true });
    res.json({ message: 'Deleted' });
});

module.exports = router;