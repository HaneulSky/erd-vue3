import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ERDSelect from '@/shared/ui/ERDSelect.vue'

const list = [
  { id: 1, name: 'Users' },
  { id: 2, name: 'Orders' }
]

describe('ERDSelect', () => {

  it('renders default label', () => {

    const wrapper = mount(ERDSelect, {
      props: {
        selectId: 'test',
        modelValue: null
      }
    })

    expect(wrapper.text()).toContain('-- Выберите таблицу --')
  })


  it('renders options from list', () => {

    const wrapper = mount(ERDSelect, {
      props: {
        selectId: 'test',
        modelValue: null,
        list
      }
    })

    const options = wrapper.findAll('option')

    expect(options).toHaveLength(3)
    expect(options[1].text()).toBe('Users')
    expect(options[2].text()).toBe('Orders')
  })


  it('sets selected value', () => {

    const wrapper = mount(ERDSelect, {
      props: {
        selectId: 'test',
        modelValue: 2,
        list
      }
    })

    const select = wrapper.find('select')

    expect((select.element as HTMLSelectElement).value).toBe('2')
  })

it('emits update:modelValue on change', async () => {

  const wrapper = mount(ERDSelect, {
    props: {
      selectId: 'test',
      modelValue: null,
      list
    }
  })

  const select = wrapper.find('select')

  await select.setValue(1)

  expect(wrapper.emitted('update:modelValue')).toBeTruthy()

  expect(wrapper.emitted('update:modelValue')![0]).toEqual([1])

})

  it('works with empty list', () => {

    const wrapper = mount(ERDSelect, {
      props: {
        selectId: 'test',
        modelValue: null,
        list: []
      }
    })

    const options = wrapper.findAll('option')

    expect(options).toHaveLength(1)
  })

})