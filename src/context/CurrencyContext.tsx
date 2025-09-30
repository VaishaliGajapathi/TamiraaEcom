import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    ReactNode,
} from 'react'

export type SupportedCurrency = 'INR' | 'USD'

interface CurrencyContextValue {
    currency: SupportedCurrency
    setCurrency: (c: SupportedCurrency) => void
    convertPriceString: (raw: string | number) => string
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(
    undefined
)

const USD_TO_INR = 87.72;
const INR_TO_USD = 1 / USD_TO_INR;

function formatINR(amount: number): string {
    return amount.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
    })
}

function formatUSD(amount: number): string {
    return amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
    })
}

function parseNumber(value: string): number | null {
    const sanitized = value.replace(/[,\s]/g, '')
    const match = sanitized.match(/-?\d+(?:\.\d+)?/)
    return match ? parseFloat(match[0]) : null
}

function convertOne(amountInINR: number, target: SupportedCurrency): string {
    if (target === 'USD') return formatUSD(amountInINR * INR_TO_USD)
    return formatINR(amountInINR)
}

function convertPriceRaw(
    raw: string | number,
    target: SupportedCurrency
): string {
    if (typeof raw === 'number') return convertOne(raw, target)

    if (!raw) return ''

    if (raw.includes('-')) {
        const parts = raw.split('-').map((s) => s.trim())
        const converted = parts.map((part) => {
            const num = parseNumber(part)
            if (num === null || Number.isNaN(num)) return part
            return convertOne(num, target)
        })
        return converted.join(' - ')
    }

    const amount = parseNumber(raw)
    if (amount === null || Number.isNaN(amount)) return raw
    return convertOne(amount, target)
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrency] = useState<SupportedCurrency>(() => {
        const saved =
            typeof window !== 'undefined'
                ? (localStorage.getItem('currency') as SupportedCurrency | null)
                : null
        return saved ?? 'INR'
    })

    useEffect(() => {
        try {
            localStorage.setItem('currency', currency)
        } catch {
            // Ignore write errors (e.g., private browsing mode)
        }
    }, [currency])

    const value = useMemo<CurrencyContextValue>(
        () => ({
            currency,
            setCurrency,
            convertPriceString: (raw: string | number) =>
                convertPriceRaw(raw, currency),
        }),
        [currency]
    )

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    )
}

export function useCurrency(): CurrencyContextValue {
    const ctx = useContext(CurrencyContext)
    if (!ctx)
        throw new Error('useCurrency must be used within CurrencyProvider')
    return ctx
}

export function Price({
    value,
    className,
}: {
    value: string | number
    className?: string
}) {
    const { convertPriceString } = useCurrency()
    return <span className={className}>{convertPriceString(value)}</span>
}
