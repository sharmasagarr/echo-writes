"use server"

import prisma from '@/lib/prisma'
import { SignupFormSchema, FormState } from '@/lib/definitions'
import bcrypt from 'bcryptjs'
import { generateUniqueUsername } from '@/lib/utils/getUniqueUsername'
import { createAuthorInSanity } from '@/app/sanity/create-author'
import { client } from '@/app/sanity/lib/client'

 
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

        const username = await generateUniqueUsername(name);
        
        // Creating the user in database
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: passwordHash,
                username
            },
        });

        if (!user) {
            return {
                success: false,
                message: 'An error occurred while creating your account.',
            }
        }

        //Creating author in sanity
        const authorExists = await client.fetch(
        `*[_type == "author" && email == $email][0]`,
        { email: user.email }
        );

        if (!authorExists) {
            const dbUser = await prisma.user.findUnique({
                where: { email: user.email },
                select: {
                    username: true,
                }
            });
            await createAuthorInSanity({
                id: user.id,
                name: user.name,
                email: user.email,
                image: null,
                username: dbUser?.username ?? "",
            });
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