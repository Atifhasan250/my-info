'use server';

import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/mongodb';
import { Profile } from '@/lib/models/Profile';
import { Social } from '@/lib/models/Social';
import { CustomLink } from '@/lib/models/CustomLink';
import { Project } from '@/lib/models/Project';
import { decrypt, login as authLogin } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function loginAction(username: string, password: string) {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  const success = await authLogin(formData);
  if (success) {
    return { success: true };
  } else {
    return { success: false, error: 'Invalid username or password' };
  }
}

async function verifyAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) throw new Error('Unauthorized');
  await decrypt(session);
}

// Profile
export async function updateProfileAction(data: any) {
  await verifyAuth();
  await connectToDatabase();
  await Profile.findOneAndUpdate({}, data, { upsert: true });
  revalidatePath('/');
  return { success: true };
}

// Socials
export async function upsertSocialAction(data: any) {
  await verifyAuth();
  await connectToDatabase();
  if (data._id) {
    await Social.findByIdAndUpdate(data._id, data);
  } else {
    await Social.create(data);
  }
  revalidatePath('/');
  return { success: true };
}

export async function deleteSocialAction(id: string) {
  await verifyAuth();
  await connectToDatabase();
  await Social.findByIdAndDelete(id);
  revalidatePath('/');
  return { success: true };
}

// Links
export async function upsertLinkAction(data: any) {
  await verifyAuth();
  await connectToDatabase();
  if (data._id) {
    await CustomLink.findByIdAndUpdate(data._id, data);
  } else {
    await CustomLink.create(data);
  }
  revalidatePath('/');
  return { success: true };
}

export async function deleteLinkAction(id: string) {
  await verifyAuth();
  await connectToDatabase();
  await CustomLink.findByIdAndDelete(id);
  revalidatePath('/');
  return { success: true };
}

// Projects
export async function upsertProjectAction(data: any) {
  await verifyAuth();
  await connectToDatabase();
  if (data._id) {
    await Project.findByIdAndUpdate(data._id, data);
  } else {
    await Project.create(data);
  }
  revalidatePath('/');
  revalidatePath('/projects');
  return { success: true };
}

export async function deleteProjectAction(id: string) {
  await verifyAuth();
  await connectToDatabase();
  await Project.findByIdAndDelete(id);
  revalidatePath('/');
  revalidatePath('/projects');
  return { success: true };
}

// Reordering
export async function reorderSocialsAction(items: { _id: string; order: number }[]) {
  await verifyAuth();
  await connectToDatabase();
  await Promise.all(items.map(item => Social.findByIdAndUpdate(item._id, { order: item.order })));
  revalidatePath('/');
  return { success: true };
}

export async function reorderLinksAction(items: { _id: string; order: number }[]) {
  await verifyAuth();
  await connectToDatabase();
  await Promise.all(items.map(item => CustomLink.findByIdAndUpdate(item._id, { order: item.order })));
  revalidatePath('/');
  return { success: true };
}

export async function reorderProjectsAction(items: { _id: string; order: number }[]) {
  await verifyAuth();
  await connectToDatabase();
  await Promise.all(items.map(item => Project.findByIdAndUpdate(item._id, { order: item.order })));
  revalidatePath('/');
  revalidatePath('/projects');
  return { success: true };
}

