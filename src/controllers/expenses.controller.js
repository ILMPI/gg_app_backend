const Expense = require('../models/expenses.model');

const createExpense = async (req, res, next) => {
    
     const groups_id = req.body.groups_id;

     // Meto en array lo datos de los miembros del grupo
     const [listMembersGroup] = await Expense.listMembers(groups_id);

     // Inserto el gasto en la tabla de gastos
     const [result] = await Expense.insertExpense(req.body);

     const [expense] = await Expense.getExpenseByConcept(req.body.concept, groups_id);
     
     const expenses_id = expense[0].expense_id;
     console.log(expenses_id);
      
     // reparto guarda el gasto repartido entre los usuariow
     const reparto = Number(req.body.amount)/listMembersGroup.length;;
    
     // Asigno el gasto a cada miembro del grupo, hago una query para actualizarlo en la lista de membership
     for (let id = 0; id < listMembersGroup.length; id++) {

       if(Number(req.body.payer_user_id) === listMembersGroup[id].users_id){
         // Es el usuario que ha pagado el ticket
         const [result2] = await Expense.asignExpense(listMembersGroup[id].users_id, expenses_id, reparto, 'Paid');
         const resultado = Number(req.body.amount) - reparto;
         // A su balance hay que añadir resultado, en positivo, por pagarlo
         const balance = Number(listMembersGroup[id].balance) + resultado;
         // Hacer update en balance de tabla membership
         const [result3] = await Expense.updateBalance(listMembersGroup[id].users_id, groups_id, balance);
       }else{
         // Es usuario que no ha pagado el ticket
         const [result2] = await Expense.asignExpense(listMembersGroup[id].users_id, expenses_id, reparto, 'Reported');
         // A su balance hay que añadir en negativo reparto);
         const balance = Number(listMembersGroup[id].balance) - reparto;
         const [result3] = await Expense.updateBalance(listMembersGroup[id].users_id, groups_id, balance);    
       }
     }
    
    res.json(result);

}


module.exports = {
    createExpense
}