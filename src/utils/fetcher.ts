export const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const data = await res.json();
    const error: any = new Error(data.message);
    error.status = res.status;
    throw error;
  }
  const data = await res.json();
  return data;
};
