const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = 8080;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(bodyParser.json());

// Helper function to read data
const readData = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { message: [] };
  }
};

// Helper function to write data
const writeData = async (data) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
};

// GET all alerts
app.get('/alerts', async (req, res) => {
  try {
    const data = await readData();
    res.json(data.message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// GET single alert by ID
app.get('/alerts/:id', async (req, res) => {
  try {
    const data = await readData();
    const alert = data.message.find(item => item.id === req.params.id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// POST create new alert
app.post('/alerts', async (req, res) => {
  try {
    const data = await readData();
    const newAlert = {
      id: uuidv4(),
      ...req.body
    };
    data.message.push(newAlert);
    await writeData(data);
    res.status(201).json(newAlert);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

// PUT update alert
app.put('/alerts/:id', async (req, res) => {
  try {
    const data = await readData();
    const index = data.message.findIndex(item => item.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    data.message[index] = { id: req.params.id, ...req.body };
    await writeData(data);
    res.json(data.message[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update alert' });
  }
});

// DELETE alert
app.delete('/alerts/:id', async (req, res) => {
  try {
    const data = await readData();
    const index = data.message.findIndex(item => item.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    const deletedAlert = data.message.splice(index, 1);
    await writeData(data);
    res.json({ message: 'Alert deleted', alert: deletedAlert[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete alert' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
