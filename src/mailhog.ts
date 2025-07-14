import { APIRequestContext } from "@playwright/test";

export class MailHog {
	private readonly apiUrl: string;
	private readonly deleteUrl: string;
	private readonly timeout: number;

	constructor(mailhogBaseUrl: string = "http://localhost:8025", timeout: number = 30000) {
		this.timeout = timeout;
		this.apiUrl = `${mailhogBaseUrl}/api/v2/messages`;
		this.deleteUrl = `${mailhogBaseUrl}/api/v1/messages`;
	}

	public async waitForEmails(apiContext: APIRequestContext, minEmailsCount: number): Promise<any> {
		const startTime = Date.now();

		while (Date.now() - startTime < this.timeout) {
			const response = await apiContext.get(this.apiUrl);
			const emails = await response.json();

			if (emails.total >= minEmailsCount) {
				console.log(`INFO: Found ${emails.total} emails.`);
				return emails;
			}

			console.log("INFO: Waiting for more emails...");
			await new Promise((resolve) => setTimeout(resolve, 5000));
		}

		throw new Error(`Timeout reached: Less than ${minEmailsCount} emails found.`);
	}

	public async getVerificationCodeByEmailSubjectAndRecipient(
		apiContext: APIRequestContext,
		subjectToFind: string,
		recipientToFind: string
	): Promise<string> {
		const startTime = Date.now();

		while (Date.now() - startTime < this.timeout) {
			const response = await apiContext.get(this.apiUrl);
			const emails = await response.json();

			const email = emails.items.find(
				(email) =>
					email?.Content?.Headers?.Subject?.some((s) => s.includes(subjectToFind)) &&
					email?.Content?.Headers?.To?.some((to) => to.includes(recipientToFind))
			);

			if (email) {
				console.log(`INFO: Email with subject '${subjectToFind}' and recipient '${recipientToFind}' found.`);
				return email.Content.Headers["X-Vericode"][0];
			}

			console.log("INFO: Waiting for email with specified subject and recipient...");
			await new Promise((resolve) => setTimeout(resolve, 3000));
		}

		throw new Error(`Timeout reached: Email with subject '${subjectToFind}' and recipient '${recipientToFind}' not found.`);
	}

	public async getDownloadLinkByEmailSubject(apiContext: APIRequestContext, subjectToFind: string): Promise<string> {
		const startTime = Date.now();

		while (Date.now() - startTime < this.timeout) {
			const response = await apiContext.get(this.apiUrl);
			const emails = await response.json();

			const email = emails.items.find((email) =>
				email?.Content?.Headers?.Subject?.some((s) => s.includes(subjectToFind))
			);

			if (email) {
				console.log(`INFO: Email with subject '${subjectToFind}' found.`);
				return email.Content.Headers["cs-downloadurl"][0];
			}

			console.log("INFO: Waiting for email with specified subject...");
			await new Promise((resolve) => setTimeout(resolve, 3000));
		}

		throw new Error(`Timeout reached: Email with subject '${subjectToFind}' not found.`);
	}

	public async deleteAllEmails(apiContext: APIRequestContext): Promise<void> {
		const response = await apiContext.delete(this.deleteUrl);
		if (response.status() === 200) {
			console.log("INFO: All emails deleted successfully.");
		} else {
			throw new Error(`Failed to delete emails. Status: ${response.status()}`);
		}
	}
}
