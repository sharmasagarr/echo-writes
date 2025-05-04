"use server"

import { PrismaClient } from '@prisma/client'
import { SignupFormSchema, FormState } from '@/lib/definitions'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
 
export async function signup(_state: FormState, formData: FormData) {
    try{
        //1. Validate form fields
        const validatedFields = SignupFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        })
    
        // If any form fields are invalid, return early
        if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
        }
    
        // 2. Prepare data for insertion into database
        const { name, email, password } = validatedFields.data
        // Hashing the user's password before storing it
        const passwordHash = await bcrypt.hash(password, 12)

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return {
                success: false,
                message: 'An user already exists with this email, try logging in',
            }
        }

        // Creating the user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
            },
        });

        if (!user) {
            return {
                success: false,
                message: 'An error occurred while creating your account.',
            }
        }

        return {
            success: true,
            message: 'User created successfully!',
        }
        
    } catch(error) {
        console.error(error) 
        return {
            message: 'An unexpected error occurred.',
        }
    }
} 