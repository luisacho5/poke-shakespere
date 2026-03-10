import '@testing-library/jest-dom'

const localStorageMock = (() => {
    let store = {}

    return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => {
            store[key] = value.toString()
        }),
        removeItem: jest.fn((key) => {
            delete store[key]
        }),
        clear: jest.fn(() => {
            store = {}
        }),
    }
})()

global.localStorage = localStorageMock

class MockHeaders extends Map {
    constructor(init) {
        super()
        if (init) {
            if (init instanceof Headers || init instanceof MockHeaders) {
                for (const [key, value] of init.entries()) {
                    this.set(key.toLowerCase(), value)
                }
            } else if (Array.isArray(init)) {
                for (const [key, value] of init) {
                    this.set(key.toLowerCase(), value)
                }
            } else if (typeof init === 'object') {
                for (const [key, value] of Object.entries(init)) {
                    this.set(key.toLowerCase(), value)
                }
            }
        }
    }

    append(name, value) {
        const existing = this.get(name.toLowerCase())
        this.set(
            name.toLowerCase(),
            existing ? `${existing}, ${value}` : value
        )
    }
}

global.Headers = MockHeaders

class MockRequest {
    constructor(input, init) {
        if (typeof input === 'string') {
            this._url = new URL(input)
        } else {
            this._url = input
        }
        this.method = init?.method || 'GET'
        this.headers = new MockHeaders(init?.headers)
    }

    get url() {
        return this._url.toString()
    }
}

global.Request = MockRequest

class MockResponse {
    constructor(body, init) {
        this.body = body
        this.status = init?.status || 200
        this.headers = new MockHeaders(init?.headers)
        this.ok = this.status >= 200 && this.status < 300
    }

    async json() {
        if (typeof this.body === 'string') {
            return JSON.parse(this.body)
        }
        return this.body
    }

    async text() {
        return this.body.toString()
    }

    static json(data, init) {
        return new MockResponse(JSON.stringify(data), {
            ...init,
            headers: {
                'Content-Type': 'application/json',
                ...init?.headers,
            },
        })
    }
}

global.Response = MockResponse
