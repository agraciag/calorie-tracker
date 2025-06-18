// index.ts
// Last updated: 2025-06-18 23:00:00

import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config(); // Load environment variables from .env

const prisma = new PrismaClient();
const app = express();

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to parse optional float values
const parseOptionalFloat = (value: any): number | null | undefined => {
    if (value === null || value === undefined) return value;
    const num = parseFloat(value);
    return isNaN(num) ? undefined : num;
};

// Serve main page
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Create a new record
app.post('/records', async (req: Request, res: Response) => {
    try {
        // Extract all fields from request body
        const {
            userId, date, weight, bmi, bodyFat, water, metabolism, visceralFat, boneFat, protein,
            muscle, bodyAge, idealWeight, alcoholUnits, alcoholCalories, dietLog, activeHours, caloriesBurned
        } = req.body;

        // Basic validation
        if (typeof userId !== 'number' || userId <= 0) {
            return res.status(400).json({ error: 'Invalid userId provided.' });
        }
        if (weight !== undefined && weight !== null && (typeof weight !== 'number' || weight <= 0)) {
            return res.status(400).json({ error: 'Invalid weight provided. Must be a positive number or null.' });
        }
        if (dietLog !== undefined && !['excedido', 'bien', 'muy bien', null].includes(dietLog)) {
            return res.status(400).json({ error: 'Invalid dietLog value.' });
        }

        // Create record in database
        const record = await prisma.record.create({
            data: {
                userId,
                date: date ? new Date(date) : new Date(),
                weight: parseOptionalFloat(weight),
                bmi: parseOptionalFloat(bmi),
                bodyFat: parseOptionalFloat(bodyFat),
                water: parseOptionalFloat(water),
                metabolism: parseOptionalFloat(metabolism),
                visceralFat: parseOptionalFloat(visceralFat),
                boneFat: parseOptionalFloat(boneFat),
                protein: parseOptionalFloat(protein),
                muscle: parseOptionalFloat(muscle),
                bodyAge: parseOptionalFloat(bodyAge),
                idealWeight: parseOptionalFloat(idealWeight),
                alcoholUnits: parseOptionalFloat(alcoholUnits),
                alcoholCalories: parseOptionalFloat(alcoholCalories),
                dietLog,
                activeHours: parseOptionalFloat(activeHours),
                caloriesBurned: parseOptionalFloat(caloriesBurned),
            },
        });

        res.json(record);
    } catch (error) {
        console.error('Error creating record:', error);
        if (error instanceof Error) {
            return res.status(500).json({ error: 'Error creating record', details: error.message });
        }
        res.status(500).json({ error: 'An unknown error occurred while creating the record' });
    }
});

// Get all records for a user
app.get('/records/:userId', async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const parsedUserId = parseInt(userId);
        if (isNaN(parsedUserId)) {
            return res.status(400).json({ error: 'Invalid userId format. Must be an integer.' });
        }
        const records = await prisma.record.findMany({
            where: { userId: parsedUserId },
            orderBy: { date: 'desc' },
        });
        res.json(records);
    } catch (error) {
        console.error('Error retrieving records:', error);
        if (error instanceof Error) {
            return res.status(500).json({ error: 'Error retrieving records', details: error.message });
        }
        res.status(500).json({ error: 'An unknown error occurred while retrieving records' });
    }
});

// Update a record
app.put('/records/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const recordId = parseInt(id);
        if (isNaN(recordId)) {
            return res.status(400).json({ error: 'Invalid record ID format. Must be an integer.' });
        }

        // Extract all fields from request body
        const {
            date, weight, bmi, bodyFat, water, metabolism, visceralFat, boneFat, protein,
            muscle, bodyAge, idealWeight, alcoholUnits, alcoholCalories, dietLog, activeHours, caloriesBurned
        } = req.body;

        // Basic validation
        if (weight !== undefined && weight !== null && (typeof weight !== 'number' || weight <= 0)) {
            return res.status(400).json({ error: 'Invalid weight provided. Must be a positive number or null.' });
        }
        if (dietLog !== undefined && !['excedido', 'bien', 'muy bien', null].includes(dietLog)) {
            return res.status(400).json({ error: 'Invalid dietLog value.' });
        }

        // Prepare data object
        const updateData: any = {
            weight: parseOptionalFloat(weight),
            bmi: parseOptionalFloat(bmi),
            bodyFat: parseOptionalFloat(bodyFat),
            water: parseOptionalFloat(water),
            metabolism: parseOptionalFloat(metabolism),
            visceralFat: parseOptionalFloat(visceralFat),
            boneFat: parseOptionalFloat(boneFat),
            protein: parseOptionalFloat(protein),
            muscle: parseOptionalFloat(muscle),
            bodyAge: parseOptionalFloat(bodyAge),
            idealWeight: parseOptionalFloat(idealWeight),
            alcoholUnits: parseOptionalFloat(alcoholUnits),
            alcoholCalories: parseOptionalFloat(alcoholCalories),
            dietLog,
            activeHours: parseOptionalFloat(activeHours),
            caloriesBurned: parseOptionalFloat(caloriesBurned),
        };

        // Only update date if provided
        if (date) {
            updateData.date = new Date(date);
        }

        // Update record in database
        const updatedRecord = await prisma.record.update({
            where: { id: recordId },
            data: updateData,
        });

        res.json(updatedRecord);
    } catch (error) {
        console.error('Error updating record:', error);
        if (error instanceof Error) {
            if (error.message.includes('Record to update not found')) {
                return res.status(404).json({ error: 'Record not found' });
            }
            return res.status(500).json({ error: 'Error updating record', details: error.message });
        }
        res.status(500).json({ error: 'An unknown error occurred while updating the record' });
    }
});

// Delete a record
app.delete('/records/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const recordId = parseInt(id);
        if (isNaN(recordId)) {
            return res.status(400).json({ error: 'Invalid record ID format. Must be an integer.' });
        }

        await prisma.record.delete({
            where: { id: recordId }
        });

        res.json({ message: 'Record deleted successfully', id: recordId });
    } catch (error) {
        console.error('Error deleting record:', error);
        if (error instanceof Error) {
            if (error.message.includes('Record to delete does not exist')) {
                return res.status(404).json({ error: 'Record not found' });
            }
            return res.status(500).json({ error: 'Error deleting record', details: error.message });
        }
        res.status(500).json({ error: 'An unknown error occurred while deleting the record' });
    }
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
