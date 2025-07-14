import { test, expect, request } from '@playwright/test';
import { MailHog } from '../src/mailhog';

test('example: get verification code by subject and recipient', async () => {
	const mailhog = new MailHog("http://localhost:8025"); // Replace if needed
	const apiContext = await request.newContext();

	const code = await mailhog.getVerificationCodeByEmailSubjectAndRecipient(
		apiContext,
		'Your verification code',
		'test@example.com'
	);

	expect(code).toBeDefined();
	console.log('Verification code:', code);
});

test('example: get download link by subject', async () => {
	const mailhog = new MailHog();
	const apiContext = await request.newContext();

	const link = await mailhog.getDownloadLinkByEmailSubject(apiContext, 'Files from John Doe');

	expect(link).toMatch(/^http/);
	console.log('Download link:', link);
});

test('example: delete all emails', async () => {
	const mailhog = new MailHog();
	const apiContext = await request.newContext();

	await mailhog.deleteAllEmails(apiContext);
});
