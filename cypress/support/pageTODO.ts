interface PageTODO{
  visit(): this;
  addTodo(todo: string): this;
  toggleTodo(todo: string): this;
  deleteTodo(todo: string): this;
  itemNotExist(todo: string): this;
  checkValue(s: string, value: string): this;
  todoExist(todo: string): this;
  itemExist(todo: string): this;
  checkNbTodo(nb: number): this;
}

class PageTODOClass implements PageTODO{
  visit(){
    cy.visit('/');
    return this;
  }

  addTodo(todo: string){
    cy.get('.new-todo').type(todo);
    cy.get('.new-todo').type('{enter}');
    return this;
  }

  toggleTodo(todo: string){
    cy.get('.todo-list li').contains(todo).find('.toggle').click();
    return this;
  }

  deleteTodo(todo: string){
    cy.get('.todo-list li').contains(todo).find('.destroy').click();
    return this;
  }

  itemNotExist(s: string) {
    cy.get(s).should('not.exist')
    return this;
  }

  itemExist(item: string): this {
    cy.get(item).should('exist')
    return this;
  }

  checkValue(s: string, value: string){
    cy.get(s).should('have.value', value)
    return this;
  }

  todoExist(todo: string){
    cy.get('.todo-list li').contains(todo);
    return this;
  }

  checkNbTodo(nb: number){
    cy.get('.todo-list li').should('have.length', nb);
    return this;
  }

  createTodoList(testTodo: string) {
    cy.get('.create-todo-box').click()
    cy.get('.create-todo-txt').type(testTodo)
    cy.get('.create-todo-txt').type('{enter}')
    return this;
  }
}

export const pageTODO: PageTODOClass = new PageTODOClass();
