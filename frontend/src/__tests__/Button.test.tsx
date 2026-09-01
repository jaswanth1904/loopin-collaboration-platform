import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { Button } from '@/components/ui/button'

test('renders the button with text', () => {
    render(<Button>Click Me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
})

test('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Submit</Button>)
    const button = screen.getByRole('button', { name: /submit/i })

    await user.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
})
