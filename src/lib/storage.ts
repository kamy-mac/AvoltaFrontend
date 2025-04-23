// import { Post, Comment, User } from '../types';

// // Initialize default data if not exists
// const initializeStorage = () => {
//   if (!localStorage.getItem('posts')) {
//     localStorage.setItem('posts', JSON.stringify([]));
//   }
//   if (!localStorage.getItem('users')) {
//     localStorage.setItem('users', JSON.stringify([
//       {
//         id: '1',
//         email: 'superadmin@avolta.be',
//         password: 'superadmin123',
//         role: 'superadmin',
//         createdAt: new Date(),
//         status: 'active'
//       }
//     ]));
//   }
//   if (!localStorage.getItem('newsletter')) {
//     localStorage.setItem('newsletter', JSON.stringify([]));
//   }
// };

// initializeStorage();

// // Helper function to check if a publication is currently valid
// const isPublicationValid = (publication: Post): boolean => {
//   const now = new Date();
//   const validFrom = new Date(publication.validFrom);
//   const validTo = new Date(publication.validTo);
//   return now >= validFrom && now <= validTo;
// };

// // User management
// export const createUser = async (userData: {
//   email: string;
//   password: string;
//   role: 'admin';
// }): Promise<User> => {
//   const users = JSON.parse(localStorage.getItem('users') || '[]');

//   // Check if email already exists
//   if (users.some((user: User) => user.email === userData.email)) {
//     throw new Error('Un utilisateur avec cet email existe déjà');
//   }

//   const newUser: User = {
//     id: Date.now().toString(),
//     email: userData.email,
//     password: userData.password,
//     role: userData.role,
//     createdAt: new Date(),
//     status: 'active'
//   };

//   users.push(newUser);
//   localStorage.setItem('users', JSON.stringify(users));
//   return newUser;
// };

// export const getUsers = async (): Promise<User[]> => {
//   const users = JSON.parse(localStorage.getItem('users') || '[]');
//   return users.map((user: any) => ({
//     ...user,
//     createdAt: new Date(user.createdAt),
//     lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined
//   }));
// };

// export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
//   const users = JSON.parse(localStorage.getItem('users') || '[]');
//   const userIndex = users.findIndex((u: User) => u.id === id);

//   if (userIndex === -1) {
//     throw new Error('Utilisateur non trouvé');
//   }

//   // Prevent role change to superadmin
//   if (userData.role === 'superadmin') {
//     throw new Error('Impossible de promouvoir un utilisateur en super admin');
//   }

//   const updatedUser = {
//     ...users[userIndex],
//     ...userData,
//     id: users[userIndex].id, // Ensure ID cannot be changed
//     role: users[userIndex].role === 'superadmin' ? 'superadmin' : userData.role || users[userIndex].role // Prevent superadmin role change
//   };

//   users[userIndex] = updatedUser;
//   localStorage.setItem('users', JSON.stringify(users));
//   return updatedUser;
// };

// export const deleteUser = async (id: string): Promise<void> => {
//   const users = JSON.parse(localStorage.getItem('users') || '[]');
//   const userToDelete = users.find((u: User) => u.id === id);

//   if (!userToDelete) {
//     throw new Error('Utilisateur non trouvé');
//   }

//   if (userToDelete.role === 'superadmin') {
//     throw new Error('Impossible de supprimer un super admin');
//   }

//   const filteredUsers = users.filter((user: User) => user.id !== id);
//   localStorage.setItem('users', JSON.stringify(filteredUsers));
// };

// // Newsletter subscribers
// export interface NewsletterSubscriber {
//   id: string;
//   email: string;
//   firstName?: string;
//   lastName?: string;
//   created_at: string;
//   confirmed: boolean;
//   last_sent_at: string | null;
// }

// export const subscribeToNewsletter = async (email: string, firstName?: string, lastName?: string): Promise<void> => {
//   try {
//     // Store locally
//     const subscribers = JSON.parse(localStorage.getItem('newsletter') || '[]');
//     const existingSubscriber = subscribers.find((sub: NewsletterSubscriber) => sub.email === email);

//     if (!existingSubscriber) {
//       const newSubscriber = {
//         id: Date.now().toString(),
//         email,
//         firstName,
//         lastName,
//         created_at: new Date().toISOString(),
//         confirmed: true,
//         last_sent_at: null
//       };

//       subscribers.push(newSubscriber);
//       localStorage.setItem('newsletter', JSON.stringify(subscribers));
//     }
//   } catch (error) {
//     console.error('Error subscribing to newsletter:', error);
//     throw error;
//   }
// };

// export const getNewsletterSubscribers = async (): Promise<NewsletterSubscriber[]> => {
//   return JSON.parse(localStorage.getItem('newsletter') || '[]');
// };

// export const deleteNewsletterSubscriber = async (id: string): Promise<void> => {
//   const subscribers = JSON.parse(localStorage.getItem('newsletter') || '[]');
//   const filteredSubscribers = subscribers.filter((sub: NewsletterSubscriber) => sub.id !== id);
//   localStorage.setItem('newsletter', JSON.stringify(filteredSubscribers));
// };

// export const login = async (email: string, password: string): Promise<User | null> => {
//   const users = JSON.parse(localStorage.getItem('users') || '[]');
//   const user = users.find((u: User) => u.email === email && u.password === password);
//   if (user) {
//     // Update last login time
//     const updatedUser = {
//       ...user,
//       lastLogin: new Date()
//     };

//     // Update user in storage
//     const updatedUsers = users.map((u: User) =>
//       u.id === user.id ? updatedUser : u
//     );
//     localStorage.setItem('users', JSON.stringify(updatedUsers));

//     // Store current user
//     localStorage.setItem('currentUser', JSON.stringify(updatedUser));
//     return updatedUser;
//   }
//   return null;
// };

// export const logout = async () => {
//   localStorage.removeItem('currentUser');
// };

// export const getCurrentUser = (): User | null => {
//   const userStr = localStorage.getItem('currentUser');
//   return userStr ? JSON.parse(userStr) : null;
// };

// export const createPublication = async (data: {
//   title: string;
//   content: string;
//   imageUrl: string;
//   category: string;
//   validFrom: string;
//   validTo: string;
//   sendNewsletter?: boolean;
//   authorName?: string;
//   authorEmail?: string;
// }): Promise<Post> => {
//   const user = getCurrentUser();
//   const posts = JSON.parse(localStorage.getItem('posts') || '[]');
//   const newPost: Post = {
//     id: Date.now().toString(),
//     title: data.title,
//     content: data.content,
//     imageUrl: data.imageUrl,
//     category: data.category,
//     validFrom: new Date(data.validFrom),
//     validTo: new Date(data.validTo),
//     createdAt: new Date(),
//     likes: 0,
//     comments: [],
//     status: user?.role === 'superadmin' ? 'published' : 'pending',
//     authorId: user?.id || '',
//     authorName: data.authorName || user?.email.split('@')[0] || 'Anonymous',
//     authorEmail: data.authorEmail || user?.email || 'anonymous@example.com'
//   };

//   posts.push(newPost);
//   localStorage.setItem('posts', JSON.stringify(posts));

//   return newPost;
// };

// export const updatePublication = async (publication: Post): Promise<Post> => {
//   const posts = JSON.parse(localStorage.getItem('posts') || '[]');
//   const updatedPosts = posts.map((post: Post) =>
//     post.id === publication.id ? publication : post
//   );
//   localStorage.setItem('posts', JSON.stringify(updatedPosts));
//   return publication;
// };

// export const getPublishedPublications = async (): Promise<Post[]> => {
//   const posts = JSON.parse(localStorage.getItem('posts') || '[]');
//   const now = new Date();

//   return posts
//     .filter((post: Post) => {
//       // Only return published posts that are currently valid
//       return post.status === 'published' && isPublicationValid(post);
//     })
//     .map((post: any) => ({
//       ...post,
//       validFrom: new Date(post.validFrom),
//       validTo: new Date(post.validTo),
//       createdAt: new Date(post.createdAt),
//       comments: post.comments.map((comment: any) => ({
//         ...comment,
//         createdAt: new Date(comment.createdAt)
//       }))
//     }));
// };

// export const getPublications = async (): Promise<Post[]> => {
//   const posts = JSON.parse(localStorage.getItem('posts') || '[]');
//   const user = getCurrentUser();

//   return posts
//     .map((post: any) => ({
//       ...post,
//       validFrom: new Date(post.validFrom),
//       validTo: new Date(post.validTo),
//       createdAt: new Date(post.createdAt),
//       comments: post.comments.map((comment: any) => ({
//         ...comment,
//         createdAt: new Date(comment.createdAt)
//       }))
//     }))
//     .sort((a: Post, b: Post) => b.createdAt.getTime() - a.createdAt.getTime());
// };

// export const getPendingPublications = async (): Promise<Post[]> => {
//   const posts = await getPublications();
//   return posts.filter(post => post.status === 'pending');
// };

// export const approvePublication = async (id: string): Promise<void> => {
//   const posts = JSON.parse(localStorage.getItem('posts') || '[]');
//   const updatedPosts = posts.map((post: Post) =>
//     post.id === id ? { ...post, status: 'published' } : post
//   );
//   localStorage.setItem('posts', JSON.stringify(updatedPosts));
// };

// export const rejectPublication = async (id: string): Promise<void> => {
//   await deletePublication(id);
// };

// export const deletePublication = async (id: string): Promise<void> => {
//   const posts = JSON.parse(localStorage.getItem('posts') || '[]');
//   const filteredPosts = posts.filter((post: Post) => post.id !== id);
//   localStorage.setItem('posts', JSON.stringify(filteredPosts));
// };

// export const addComment = async (publicationId: string, content: string): Promise<Comment> => {
//   const posts = JSON.parse(localStorage.getItem('posts') || '[]');
//   const newComment: Comment = {
//     id: Date.now().toString(),
//     content,
//     author: 'Anonymous User',
//     createdAt: new Date()
//   };

//   const updatedPosts = posts.map((post: Post) => {
//     if (post.id === publicationId) {
//       return {
//         ...post,
//         comments: [...post.comments, newComment]
//       };
//     }
//     return post;
//   });

//   localStorage.setItem('posts', JSON.stringify(updatedPosts));
//   return newComment;
// };

// export const likePublication = async (publicationId: string): Promise<void> => {
//   const posts = JSON.parse(localStorage.getItem('posts') || '[]');
//   const updatedPosts = posts.map((post: Post) => {
//     if (post.id === publicationId) {
//       return {
//         ...post,
//         likes: post.likes + 1
//       };
//     }
//     return post;
//   });

//   localStorage.setItem('posts', JSON.stringify(updatedPosts));
// };
