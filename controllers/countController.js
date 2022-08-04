const countPage = async (req,res) => {
    if(req.session.loggedin)
    {
        res.render('count')
    }else{
        res.redirect('/Login')
    }
}

module.exports = {
    countPage
}