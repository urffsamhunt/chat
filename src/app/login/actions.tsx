'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/app/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  

  if (error) {
  const message = encodeURIComponent(error.message);
  redirect(`/error?message=${message}`);
}



  revalidatePath('/chat', 'layout')
  redirect('/chat')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const username = formData.get('username') as string ?? "NULL";

  // 1. Check if username already exists
  const { data: existingUser, error: usernameError } = await supabase
    .from('users')
    .select('username')
    .eq('username', username)
    .single();

  if (existingUser) {
    // Username already exists
    
    redirect('/error?reason=username-taken');
  }

  // 2. Proceed with sign up
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('full_name') as string ?? "NULL",
        avatar_url: formData.get('avatar_url') as string ?? "",
        username: username,
      },
    }
  }

  const { data: signUpData, error } = await supabase.auth.signUp(data);


  if (error) {
  const message = encodeURIComponent(error.message);
  redirect(`/error?message=${message}`);
  }


  // 3. Insert into usernames table
  if (!signUpData || !signUpData.user) {
    redirect('/error?reason=signup-failed');
  }
  
  const user_id = signUpData.user.id;
  const last_active = new Date().toISOString();
  const { error: insertError } = await supabase
    .from('users')
    .insert({ user_id, username, last_active });

  if (insertError) {
    console.log(insertError);
    redirect('/error?reason=username-insert-failed');
  }

  revalidatePath('/chat/home', 'layout')
  redirect('/chat/home')
}

export async function logout(formData: FormData) {
  const supabase = await createClient()
  console.log('Logging out...');

  const { error } = await supabase.auth.signOut()


  if (error) {
  const message = encodeURIComponent(error.message);
  redirect(`/error?message=${message}`);
}

  revalidatePath('/', 'layout')
  redirect('/')
}


export async function sendResetLink(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const email = formData.get('email') as string

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {  redirectTo: 'http://localhost:3000/authentication/update-password',})

 
  if (error) {
  const message = encodeURIComponent(error.message);
  redirect(`/error?message=${message}`);
}


  revalidatePath('/', 'layout')
  redirect('/')
}


export async function updatePassword(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.updateUser(data)


  if (error) {
  const message = encodeURIComponent(error.message);
  redirect(`/error?message=${message}`);
}


  revalidatePath('/', 'layout')
  redirect('/')
}