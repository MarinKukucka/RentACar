// Assuming you want to use a simple API client with no i18n or OIDC dependencies

class ApiClientBase {
    // Base URL can be dynamically set or pulled from environment variables
    baseApiUrl: string = import.meta.env.DEV ? import.meta.env.VITE_API_BACKEND_URI : '';

    // You can set your own language preference or any default settings
    protected getLanguage() {
        // Replace with your preferred logic for setting the language
        return 'en-US'; // Default language if none found
    }

    // If you're using a custom token or just want to fetch it from localStorage
    protected getToken() {
        return localStorage.getItem('auth_token'); // Replace with your token's key
    }

    // Transform the options for the API request
    protected async transformOptions(options: RequestInit): Promise<RequestInit> {
        const token = this.getToken();
        
        options.headers = {
            ...options.headers,
            Authorization: token ? `Bearer ${token}` : '', // If token exists, add it
            'Accept-Language': this.getLanguage(), // Set language header
        };
        options.credentials = 'include'; // If you need to include credentials (cookies)
        
        return options;
    }

    // Transform the API response
    protected async transformResult(
        _url: string,
        response: Response,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        processor: (response: Response) => any
    ) {
        return processor(response);
    }

    // Get the base URL for the API, with optional override
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected getBaseUrl(_defaultUrl?: string, _baseUrl?: string) {
        return this.baseApiUrl;
    }
}

export default ApiClientBase;
