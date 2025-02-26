const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const port = 3000;
const prisma = new PrismaClient();


// * ---------------------------------------------------*
// * Реализация REST API для обработки обращений        *
// * Стек:                                              *
// *    Front-end:                                      *
// *        Vite (SWC React + Axios)                    *
// *    Back-end:                                       *
// *        Node.js + ExpressJS + Prisma ORM + SQLite3  *
// * ---------------------------------------------------*


app.use(cors());                                                  // для получения запросов с веб-интерфейса
app.use(express.json({ limit: '10mb' }));                         // для парсинга JSON
app.use(express.urlencoded({ limit: '10mb', extended: true }));   // для парсинга данных формы

app.listen(port, () => {
    console.log('Тестовое задание для Effective Mobile')
    console.log(`Сервер запущен. Работа по адресу: http://localhost:${port}`);
    console.log('\nВнимание! Веб-интерфейс находится на стадии разработки, для работы с проектом рекомендуется использовать Postman.')
    console.log('\nДоступные методы API:');
    console.log('GET   /tickets — получить список обращений');
    console.log('POST  /tickets — создание нового обращения');
    console.log('POST  /tickets/big-data — создание массива обращений');
    console.log('PATCH /tickets/:id/work — взять обращение в работу');
    console.log('PATCH /tickets/:id/complete — закрыть обращение');
    console.log('PATCH /tickets/:id/cancel — отменить обращение');
});


// * ANCHOR 0. POST — Создаём массив обращений для тестирования (DEBUG mode)
app.post('/tickets/big-data', async (req, res) => {
    console.log("Получено тело запроса (Массив):", req.body);

    const tickets = req.body;

    if (!Array.isArray(tickets) || tickets.length === 0) {
        return res.status(400).json({ error: "Требуется массив обращений" });
    }

    for (const ticket of tickets) {
        const { subject, message } = ticket;
        if (!subject || !message) {
            return res.status(400).json({ error: "Требуются ключи subject и message" });
        }
    }

    try {
        const newTickets = await prisma.ticket.createMany({
            data: tickets,
        });
        res.json({ message: `${tickets.length} обращений успешно добавлено.` });
    } catch (error) {
        console.error("Ошибка при создании обращений:", error);
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
});

// * ANCHOR 0. DELETE — Удаляем большой объем обращений (DEBUG mode)
app.delete('/tickets/big-data', async (req, res) => {
    console.log("Получен запрос на удаление массива данных:", req.body);

    const { startId, endId } = req.body;

    if (!startId ||!endId) {
        return res.status(400).json({ error: "Требуются ключи startId и endId" });
    }

    try {
        const deletedTickets = await prisma.ticket.deleteMany({
            where: {
                id: {
                    gte: startId,   // id >= startId
                    lte: endId,     // id <= endId
                }
            }
        });

        console.log(`Удалено обращений: ${deletedTickets.count}`);
        res.json({ message: `${deletedTickets.count} обращений успешно удалено.` });
    } catch (error) {
        console.error("Ошибка при удалении обращений:", error);
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
});

// * ANCHOR 1. POST — Создаем новое обращение (NEW)
app.post('/tickets', async (req, res) => {
    console.log("Получено тело запроса:", req.body);

    const { subject, message } = req.body;
    if (!subject || !message) {
        return res.status(400).json({ error: "Требуются ключи subject и message" });
    }

    try {
        const newTicket = await prisma.ticket.create({
            data: { subject, message },
        });
        res.json(newTicket);
    } catch (error) {
        console.error("Ошибка при создании обращения:", error);
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
});


// * ANCHOR 2. PATCH — Берём обращение в работу (IN_PROGRESS)
app.patch('/tickets/:id/work', async (req, res) => {
    const { id } = req.params;

    const ticketId = parseInt(id, 10);

    if(isNaN(ticketId)) {
        return res.status(400).json({ error: "Некорректный ID обращения" });
    }

    try {
        const updatedTicket = await prisma.ticket.update({
            where: { id: ticketId },
            data: { status: 'IN_PROGRESS' },
        });
        res.json(updatedTicket);
        console.log(`[ID: ${id}] — Обращение взято в работу и переведено в статус "IN_PROGRESS"`);
    } catch (error) {
        console.error("Ошибка обновления статуса обращения:", error);
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
});


// * ANCHOR 3. PATCH — Завершаем обработку обращения (COMPLETED)
app.patch('/tickets/:id/complete', async (req, res) => {
    const { id } = req.params;

    const ticketId = parseInt(id, 10);

    if(isNaN(ticketId)) {
        return res.status(400).json({ error: "Некорректный ID обращения" });
    }

    try {
        const updatedTicket = await prisma.ticket.update({
            where: { id: ticketId },
            data: { status: 'COMPLETED' },
        });
        res.json(updatedTicket);
        console.log(`[ID: ${id}] — Обращение завершено и переведено в статус "COMPLETED"`);
    } catch (error) {
        console.error("Ошибка обновления статуса обращения:", error);
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
});


// * ANCHOR 4. PATCH — Отменяем обработку обращения (CANCELLED)
app.patch('/tickets/:id/cancel', async (req, res) => {
    const { id } = req.params;
    const { cancellationReason } = req.body;
    if (!cancellationReason) {
        return res.status(400).json({ error: "Требуется причина отмены" });
    }
    
    try {
        const updatedTicket = await prisma.ticket.update({
            where: { id: parseInt(id) },
            data: {
                status: 'CANCELED',
                cancellationReason,
            },
        });
        res.json(updatedTicket);
        console.log(`[ID: ${id}] — Обращение отменено и переведено в статус "CANCELED" по причине: "${cancellationReason}"`);
    } catch (error) {
        console.error("Ошибка обновления статуса обращения:", error);
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
});



// * ANCHOR 5. GET — Получаем все обращения с условной фильтрацией по конкретной дате или диапазону
app.get('/tickets', async (req, res) => {
    const { startDate, endDate, page = 1, limit = 100 } = req.query;

    const filters = {};

    if (startDate) {
        filters.createdAt = {
            gte: new Date(startDate), // gte - больше чем или равно
        };
        
        if (endDate) {
            filters.createdAt.lte = new Date(endDate); // lte - меньше чем или равно (не обязательно)
        }
    }

    const pageNumber = Math.max(1, parseInt(page));
    const pageSize = Math.min(1000, Math.max(1, parseInt(limit)));

    try {
        const tickets = await prisma.ticket.findMany({
            where: filters,
            take: pageSize,
            skip: (pageNumber - 1) * pageSize,
            orderBy: { createdAt: 'desc' },
        });

        const total = await prisma.ticket.count({ where: filters });

        res.json({
            tickets,
            total
        });
        console.log(`Получены обращения с условием: ${JSON.stringify(filters)}`);
    } catch (error) {
        console.error("Ошибка при получении обращений:", error);
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
});


// * ANCHOR 6. PATCH — Отменяем все обращения со статусом "IN_PROGRESS" (CANCELLED)
app.patch('/tickets/cancel-all', async (req, res) => {
    try {
        const updatedTickets = await prisma.ticket.updateMany({
            data: { status: 'CANCELED' },
        });
        res.json(updatedTickets);
        console.log(`Обращения со статусом "IN_PROGRESS" отменены и переведены в статус "CANCELED"`);
    } catch (error) {
        console.error("Ошибка обновления статуса всех обращений:", error);
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
});