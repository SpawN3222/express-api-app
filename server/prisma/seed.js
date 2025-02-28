const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // Создаём несколько тикетов
    const ticket1 = await prisma.ticket.create({
        data: {
            subject: 'Тревога в системе',
            message: 'Ошибка при загрузке страницы',
        },
    })

    const ticket2 = await prisma.ticket.create({
        data: {
            subject: 'Обратная связь',
            message: 'Пожалуйста, отправьте мне контактные данные',
        },
    })

    const ticket3 = await prisma.ticket.create({
        data: {
            subject: 'Требуется помощь',
            message: 'Не могу найти кнопку входа',
        },
    })

    const ticket4 = await prisma.ticket.create({
        data: {
            subject: 'Ничего не работает',
            message: 'Я не могу заполнить данные в полях!!',
        },
    })

    const ticket5 = await prisma.ticket.create({
        data: {
            subject: 'Не проходит оплата',
            message: 'Не знаю почему, но у меня не работает кнопка оплаты товара..',
        },
    })

    console.log({ ticket1, ticket2, ticket3, ticket4, ticket5 })
}

main()
    .catch(e => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })