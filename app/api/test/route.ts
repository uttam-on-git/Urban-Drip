import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        //attempt to connect to database
        await prisma.$connect()
        //return response
        return NextResponse.json({
            status: 'ok',
            message: 'Database connection successful!',
        })
    } catch (error) {
        return NextResponse.json(
            {
                status: `error: ${error}`,
                message: 'Database connection failed.',
            },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
