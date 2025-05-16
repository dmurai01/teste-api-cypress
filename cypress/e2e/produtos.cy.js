///<reference types="cypress" />

describe('Teste de API em Produtos', () => {

    let token

    beforeEach(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn => {
            token = tkn
        })
    });

    it('Deve istar produtos com sucesso - GET', () => {
        cy.request({
            method: 'GET',
            url: 'produtos'
        }).should((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
        })
    });

    it('Deve cadastrar produto com sucesso - POST', () => {
        let produto = 'Produto EBAC ' + Math.floor(Math.random() * 1000000)
        cy.cadastrarProduto(token, produto, 10, 'Cabo USB-C', 110)
            .should((response) => {
                expect((response.status)).equal(201)
                expect(response.body.message).equal('Cadastro realizado com sucesso')
            })
    });

    it('Deve validar mensagem de produto cadastrado anteriomente - POST', () => {
        /*cy.request({
              method: 'POST',
              url: 'produtos',
              headers: { authorization: token },
              body: {
                  "nome": 'Cabo USB 001',
                  "preco": 470,
                  "descricao": "Cabo USB tipo C",
                  "quantidade": 523
              },
              failOnStatusCode: false
          })*/
        cy.cadastrarProduto(token, 'Cabo USB 001', 10, 'Cabo USB-C', 110)
            .should((response) => {
                expect((response.status)).equal(400)
                expect(response.body.message).equal('Já existe produto com esse nome')
            })
    });
    it('Deve editar um produto com sucesso - PUT', () => {
        let produto = 'Produto EBAC Editado ' + Math.floor(Math.random() * 1000000)
        cy.cadastrarProduto(token, produto, 10, 'Produto Ebac Editado', 110)
            .then(response => {
                let id = response.body._id

                cy.request({
                    method: 'PUT',
                    url: `produtos/${id}`,
                    headers: { authorization: token },
                    body: {
                        "nome": produto,
                        "preco": 635,
                        "descricao": "Produto editado",
                        "quantidade": 102
                    }
                }).should(response => {
                    expect(response.body.message).to.equal('Registro alterado com sucesso')
                    expect(response.status).to.equal(200)
                })
            })
    });

    it('Deve excluir um produto com sucesso - DELETE', () => {
        cy.cadastrarProduto(token, 'Produto Ebac a ser excluido', 100, 'Excluir', 50)
            .then(response => {
                let id = response.body._id
                cy.request({
                    method: 'DELETE',
                    url: `produtos/${id}`,
                    headers: { authorization: token }
                }).should(resp => {
                    expect(resp.body.message).to.equal('Registro excluído com sucesso')
                    expect(resp.status).to.equal(200)
                })
            })
    });
});