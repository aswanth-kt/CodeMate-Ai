"use server"

export async function explain(prevState, formData) {
    const code = formData.get("code");
    const language = formData.get("language");

    try {
        const apiBaseUrl =
            import.meta.env.MODE === 'development'
                ? 'http://localhost:3001/api'
                : import.meta.env.VITE_API_BASE_URL;

        const res = await fetch(`${apiBaseUrl}/explain-code`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, language })
        })

        if(!res.ok) {
            return {
                success: false,
                error: "Failed to fetch the result"
            }
        }

        const data = await res.json();

        return {
            success: true,
            data
        }

    } catch (error) {
        return {
            success: false,
            error: `An Error Occured: ${error?.message}`
        }
    }
}