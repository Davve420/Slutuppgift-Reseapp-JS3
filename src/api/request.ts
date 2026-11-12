export async function request(
  url: string,
  serviceName: string,
): Promise<Response> {
  try {
    return await fetch(url);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Kunde inte ansluta till ${serviceName}.`, { cause: error });
    }

    throw error;
  }
}
