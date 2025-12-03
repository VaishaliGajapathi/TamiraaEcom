import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    ReactNode,
} from 'react'

export type SupportedCurrency = 'INR'

interface CurrencyContextValue {
    currency: SupportedCurrency
    setCurrency: (c: SupportedCurrency) => void
    convertPriceString: (raw: string | number) => string
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(
    undefined
)

function formatINR(amount: number): string {
    return amount.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
    })
}

function parseNumber(value: string): number | null {
    const sanitized = value.replace(/[,\s]/g, '')
    const match = sanitized.match(/-?\d+(?:\.\d+)?/)
    return match ? parseFloat(match[0]) : null
}

function convertOne(amountInINR: number): string {
    return formatINR(amountInINR)
}

function convertPriceRaw(raw: string | number): string {
    if (typeof raw === 'number') return convertOne(raw)

    if (!raw) return ''

    if (raw.includes('-')) {
        const parts = raw.split('-').map((s) => s.trim())
        const converted = parts.map((part) => {
            const num = parseNumber(part)
            if (num === null || Number.isNaN(num)) return part
            return convertOne(num)
        })
        return converted.join(' - ')
    }

    const amount = parseNumber(raw)
    if (amount === null || Number.isNaN(amount)) return raw
    return convertOne(amount)
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency] = useState<SupportedCurrency>('INR')

    const value = useMemo<CurrencyContextValue>(
        () => ({
            currency,
            setCurrency: () => {},
            convertPriceString: (raw: string | number) =>
                convertPriceRaw(raw),
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
