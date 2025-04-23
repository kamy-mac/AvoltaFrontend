// import type { MailchimpResponse } from '../types';

// /**
//  * Mock implementation of Mailchimp API for local development
//  * This simulates the Mailchimp API responses without making actual API calls
//  */

// // Simulated subscribers database
// let subscribers = [
//   {
//     id: '1',
//     email_address: 'john.doe@example.com',
//     status: 'subscribed',
//     merge_fields: {
//       FNAME: 'John',
//       LNAME: 'Doe'
//     },
//     timestamp_signup: '2023-01-15T10:30:00Z',
//     last_changed: '2023-01-15T10:30:00Z'
//   },
//   {
//     id: '2',
//     email_address: 'jane.smith@example.com',
//     status: 'subscribed',
//     merge_fields: {
//       FNAME: 'Jane',
//       LNAME: 'Smith'
//     },
//     timestamp_signup: '2023-02-20T14:45:00Z',
//     last_changed: '2023-02-20T14:45:00Z'
//   },
//   {
//     id: '3',
//     email_address: 'mark.wilson@example.com',
//     status: 'unsubscribed',
//     merge_fields: {
//       FNAME: 'Mark',
//       LNAME: 'Wilson'
//     },
//     timestamp_signup: '2023-03-10T09:15:00Z',
//     last_changed: '2023-04-05T11:20:00Z'
//   }
// ];

// /**
//  * Add a new subscriber to the mock list
//  * @param email Email address to subscribe
//  * @param firstName Optional first name
//  * @param lastName Optional last name
//  * @returns The simulated Mailchimp API response
//  */
// export async function addSubscriber(email: string, firstName?: string, lastName?: string): Promise<MailchimpResponse> {
//   // Check if subscriber already exists
//   const existingSubscriber = subscribers.find(sub => sub.email_address.toLowerCase() === email.toLowerCase());

//   if (existingSubscriber) {
//     console.log('Subscriber already exists');
//     return {
//       id: existingSubscriber.id,
//       email_address: existingSubscriber.email_address,
//       status: existingSubscriber.status
//     };
//   }

//   // Create new subscriber
//   const newSubscriber = {
//     id: (subscribers.length + 1).toString(),
//     email_address: email,
//     status: 'subscribed',
//     merge_fields: {
//       FNAME: firstName || '',
//       LNAME: lastName || ''
//     },
//     timestamp_signup: new Date().toISOString(),
//     last_changed: new Date().toISOString()
//   };

//   subscribers.push(newSubscriber);

//   return {
//     id: newSubscriber.id,
//     email_address: newSubscriber.email_address,
//     status: newSubscriber.status
//   };
// }

// /**
//  * Send a newsletter campaign about a new publication
//  * @param publication Publication data to include in the newsletter
//  * @returns The simulated Mailchimp campaign response
//  */
// export async function sendNewsletterCampaign(publication: {
//   title: string;
//   content: string;
//   imageUrl: string;
//   category: string;
// }): Promise<any> {
//   console.log('Sending newsletter campaign:', publication);

//   // Simulate API delay
//   await new Promise(resolve => setTimeout(resolve, 1000));

//   return {
//     id: 'campaign_' + Date.now(),
//     web_id: 123456,
//     type: 'regular',
//     status: 'sent',
//     recipients: {
//       list_id: 'mock_list_id',
//       recipient_count: subscribers.filter(s => s.status === 'subscribed').length
//     },
//     settings: {
//       subject_line: `Nouvelle publication: ${publication.title}`,
//       title: publication.title,
//       from_name: 'Avolta Belgique',
//       reply_to: 'contact@avolta.be'
//     },
//     tracking: {
//       opens: true,
//       clicks: true
//     },
//     content_type: 'html'
//   };
// }

// /**
//  * Get all subscribers from the mock list
//  * @returns List of subscribers
//  */
// export async function getSubscribers(): Promise<any[]> {
//   // Simulate API delay
//   await new Promise(resolve => setTimeout(resolve, 800));

//   return [...subscribers];
// }

// /**
//  * Create a segment in the mock list based on criteria
//  * @param name Name of the segment
//  * @param conditions Conditions for the segment
//  * @returns The created segment
//  */
// export async function createSegment(name: string, conditions: any[]): Promise<any> {
//   console.log('Creating segment:', name, conditions);

//   // Simulate API delay
//   await new Promise(resolve => setTimeout(resolve, 500));

//   return {
//     id: 'segment_' + Date.now(),
//     name: name,
//     member_count: Math.floor(Math.random() * subscribers.length) + 1,
//     type: 'static',
//     created_at: new Date().toISOString(),
//     updated_at: new Date().toISOString(),
//     options: {
//       match: 'all',
//       conditions: conditions
//     }
//   };
// }

// /**
//  * Send a test email to verify the configuration
//  * @param email Email address to send the test to
//  * @returns Success message
//  */
// export async function sendTestEmail(email: string): Promise<string> {
//   console.log('Sending test email to:', email);

//   // Simulate API delay
//   await new Promise(resolve => setTimeout(resolve, 1500));

//   return 'Email de test envoyé avec succès';
// }
