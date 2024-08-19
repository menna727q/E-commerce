export class ApiFeatures{
    constructor(mongooseQuery,querystring){
        this.mongooseQuery=mongooseQuery
        this.querystring=querystring
    }
    pagination(){
        let page=this.querystring.page *1 ||1 
        if(page<1) page=1
        let limit=2
        let skip= (page-1)*limit
        this.mongooseQuery.find().skip(skip).limit(limit)
        return this
    }
    filter(){
        let excludequery =["page","sort","search","select"]
        let filterQuery={... this.querystring}
        excludequery.forEach(e=>delete filterQuery[e])
        filterQuery=JSON.parse(JSON.stringify(filterQuery).replace(/(gt|lt|gte|lte|eq)/,(match)=>`$${match}`))
    
        this.mongooseQuery.find(filterQuery)
        return this
    }
    sort(){
        if(this.querystring.sort){
            this.mongooseQuery.sort(this.querystring.sort.replaceAll(","," "))
    
        }
        return this
    }
    select(){
        if(this.querystring.select){
            this.mongooseQuery.select(this.querystring.select.replaceAll(","," "))
    
        }
        return this
    }
    search(){
        if(this.querystring.search){
            this.mongooseQuery.find({
                $or:[
                   { title: {$regex:this.querystring.search,$options:"i"}},
                   {description: {$regex:this.querystring.search,$options:"i"}}
                ]
            })
    
        }
        return this
    }
}
