import express, { json } from 'express';
import { connect, Schema, model } from 'mongoose';
import cors from 'cors';
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(json());
app.use(cors());

// Connect to MongoDB
connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// FAQ Schema & Model
const faqSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const FAQ = model('FAQ', faqSchema);

// Routes
app.get('/faqs', async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/faqs', async (req, res) => {
  try {
    const { question, answer } = req.body;
    const newFAQ = new FAQ({ question, answer });
    await newFAQ.save();
    res.status(201).json(newFAQ);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/faqs/:id', async (req, res) => {
  try {
    const { question, answer } = req.body;
    const updatedFAQ = await FAQ.findByIdAndUpdate(req.params.id, { question, answer }, { new: true });
    res.json(updatedFAQ);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/faqs/:id', async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ message: 'FAQ deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
