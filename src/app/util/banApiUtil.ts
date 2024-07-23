const domain = process.env.NEXTAUTH_URL || window.location.origin;

export async function isUserBannedGET(authorEmail: string) {
  const response = await fetch(`${domain}/api/ban/status?userEmail=${authorEmail}`, {
    headers: {
      "Cache-Control": "no-store, must-revalidate",
    },
    cache: "no-cache",
  });

  if (response.ok) {
    const data = await response.json();
    return data.banned;
  }
}

export async function unbanUser(authorEmail: string) {
  await fetch(`${domain}/api/ban/unbanuser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userEmail: authorEmail }),
  });
}

export async function banUser(authorEmail: string) {
  await fetch(`${domain}/api/ban/banuser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userEmail: authorEmail }),
  });
}
