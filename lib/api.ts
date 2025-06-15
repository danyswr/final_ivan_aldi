
const SHEETS_API_URL = "https://script.google.com/macros/s/AKfycbyGVpZN_i6KRHYL-MWFKLD9TDCDWoJwT3GNjJJK4lfN8f-gLd5w7Z_m_1A6w2rF2t9E/exec"

export async function makeAPICall(data: any, endpoint = "default") {
  try {
    console.log(`Making API call to ${endpoint}:`, data)
    
    const formData = new FormData()
    formData.append("sheet", endpoint)
    
    // Add all data properties to form data
    Object.keys(data).forEach(key => {
      formData.append(key, data[key])
    })

    const response = await fetch(SHEETS_API_URL, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log(`API response from ${endpoint}:`, result)
    
    return result
  } catch (error) {
    console.error(`API call error to ${endpoint}:`, error)
    return {
      success: false,
      error: "Terjadi kesalahan saat menghubungi server. Silakan coba lagi.",
    }
  }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
