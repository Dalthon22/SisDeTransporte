class config_calendar_controller{

    constructor(){};

    async getList(req, res){
        try{
            return res.render('../views/config_Calendar.html',{});
        } catch (error) {
            console.log(error);
        }
    };
};

module.exports= new config_calendar_controller();