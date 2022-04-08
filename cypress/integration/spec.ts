import {pageTODO} from '../support/pageTODO';

describe('Tes Todo List', () => {
  it('Check Page At The Begin', () => {
    pageTODO.visit()
      .itemNotExist('.footer')
  })

  it('Add Todo', () => {
    pageTODO
      .visit()
      .createTodoList('Test Todo')
      .addTodo('abc')
      .checkNbTodo(1)
      .todoExist('abc')

    pageTODO
      .addTodo('def')
      .todoExist('def')
      .checkNbTodo(2)

    pageTODO
      .itemExist('.footer')
  })
})
