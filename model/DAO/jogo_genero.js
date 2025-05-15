/*******************************************************************************************************
 * Objetivo: Criar a comunicação com o Banco de Dados para fazer o CRUD de FilmeGeneros
 * Data: 15/05/2025
 * Autor: Rafa
 * Versão: 1.0
 ******************************************************************************************************/
//import da biblioteca do prisma client para executar os scripts SQL
const { PrismaClient } = require('@prisma/client')

//Instancia (criar um objeto a ser utilizado) a biblioteca do prisma/client
const prisma = new PrismaClient()

//Função para inserir um novo JogoGenero
const insertJogoGenero = async function(JogoGenero){
    try {
  
        let sql = `insert into tbl_jogo_genero  ( 
                                            id_jogo,
                                            id_genero
                                          ) 
                                            values 
                                          (
                                            ${JogoGenero.id_jogo},
                                            ${JogoGenero.id_genero}
                                          )`
        //console.log(sql)
  
        //Executa o scriptSQL no banco de dados e aguarda o retorno do BD para 
        //saber se deu certo                                  
        let result = await prisma.$executeRawUnsafe(sql)
  
        if(result)
            return true
        else
            return false
    } catch (error) {
        
        return false
    }
  }

//Função para atualizar um JogoGenero existente
const updateJogoGenero = async function(JogoGenero){
    try {
        let sql = `update tbl_jogo_genero set         id_jogo        = ${JogoGenero.id_jogo},
                                                      id_genero      = ${JogoGenero.id_genero}
                                          
                              where id = ${JogoGenero.id}                
                              `
        let resultJogoGenero = await prisma.$executeRawUnsafe(sql)
  
        if(resultJogoGenero)
          return true
        else
          return false
    } catch (error) {
      return false
    }
  }

//Função para excluir um FilmeGenero existente
const deleteJogoGenero = async function(id){
    try {
      let sql = `delete from tbl_jogo_genero where id = ${id}`
  
      let result = await prisma.$executeRawUnsafe(sql)
  
      if (result)
        return true
      else 
        return false
    } catch (error) {
      return false
    }
  }
  
//Função para retornar todos os FilmeGeneros existentes
const selectAllJogoGenero = async function(){

    try {
      //ScriptSQL para retornar todos os dados
      let sql = 'select * from tbl_jogo_genero order by id desc'

      //Executa o scriptSQL no BD e aguarda o retorno dos dados
      let result = await prisma.$queryRawUnsafe(sql)

      if(result)
        return result
      else
        return false

    } catch (error) {
      return false
    }
}

//Função para buscar um FilmeGenero pelo ID
const selectByIdJogoGenero = async function(id){
    try {
      let sql = `select * from tbl_jogo_genero where id = ${id}`
  
      let result = await prisma.$queryRawUnsafe(sql)
  
      if (result)
        return result
      else 
        return false
    } catch (error) {
      return false
    }
  }
  
  module.exports = {
    insertJogoGenero,
    updateJogoGenero,
    deleteJogoGenero,
    selectAllJogoGenero,
    selectByIdJogoGenero,

} 