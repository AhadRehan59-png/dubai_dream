export async function sendWinnerEmail(
  email: string,
  firstName: string,
  prizeTitle: string,
  tokenNumber: string
) {
  console.log(`[EMAIL] Winner notification to ${email}: ${firstName} won ${prizeTitle} with token ${tokenNumber}`);
  return { success: true };
}

export async function sendWinnerSMS(
  phone: string,
  prizeTitle: string,
  tokenNumber: string
) {
  console.log(`[SMS] Winner notification to ${phone}: Won ${prizeTitle}, token ${tokenNumber}`);
  return { success: true };
}

export async function sendDrawResultEmail(
  email: string,
  firstName: string,
  prizeTitle: string,
  campaignCode: string,
  winningToken: string
) {
  console.log(
    `[EMAIL] Draw result to ${email}: ${firstName}, ${campaignCode} winner is ${winningToken}`
  );
  return { success: true };
}

export async function sendPurchaseConfirmation(
  email: string,
  firstName: string,
  tokenNumbers: string[],
  drawTitle: string
) {
  console.log(
    `[EMAIL] Purchase confirmation to ${email}: ${firstName} bought tokens for ${drawTitle}: ${tokenNumbers.join(", ")}`
  );
  return { success: true };
}

export async function sendWelcomeEmail(email: string, firstName: string) {
  console.log(`[EMAIL] Welcome to ${email}: Hello ${firstName}!`);
  return { success: true };
}
