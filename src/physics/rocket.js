import * as THREE from 'three'
import { Vector3 } from 'three'
// import vector from './vector'

class Rocket {
    constructor(
        position, 
        mass,
        massFuel,
        massRocket,
        i,
        velocity,
        velocity_2,
        Cl,
        ro,
        wingarea,
        Cd,
        th,
        Ae,
        pe, 
        p0,
        f,
        fuel_type ,
        fuel_rate,
        fuel_speed,
        teta,
      
        // all var
    )
    {
        this.position = position
        this.massRocket = massRocket
        this.massFuel = massFuel
        this.mass = this.massFuel + this.massRocket
        this.f = 2
        this.i =mass * 4 / 2
        this.velocity = new THREE.Vector3(0 ,0,0)
        this.velocity_2= new THREE.Vector3(0 ,0,0)
        this.Cl = 0.2
        this.ro = 0.12
        this.wingarea = 8
        this.Cd = 0.04
        this.th = 90    
        this.Ae = 1   /// مساحة مقطع الفوهة 
        this.pe = 50
        this.p0 = 1
        this.fuel_type = 0
        this.fuel_rate = 10
        this.fuel_speed = 150  // سرعة خروج الوقود من المحرك        
        this.teta = new THREE.Vector3(0,0,0)
        //  all var
    }
    // all forces
    update(deltatime) {
        let g_f = this.gravity_force()
        let p = this.powr()
        let l_f = this.lift_force()
        let d = this.drag()
        let total_force  = new THREE.Vector3(
            g_f.x + p.x + d.x + l_f.x , // add all force.x
            g_f.y  + p.y+ d.y + l_f.y ,
            g_f.z  + p.z  + d.z +  l_f.z,
            
        ) 
        let total_torque = new THREE.Vector3(
           ( this.position.y * l_f.x ) - ( this.position.z * l_f.y ),
           - ( ( this.position.x * l_f.z ) - (this.position.z * l_f.x )),
           ( this.position.x * l_f.y ) - ( this.position.y * l_f.x)
        )
        console.log("total_torque", total_torque)

            let a = new THREE.Vector3(
                total_force.x/this.mass,
                total_force.y/this.mass,
                total_force.z/this.mass,
            )

            let elpha = new THREE.Vector3(
                total_torque.x / this.i,
                total_torque.y / this.i,
                total_torque.z / this.i,
            )
         
            
            this.velocity.x += a.x * deltatime
            this.velocity.y += a.y * deltatime
            this.velocity.z += a.z * deltatime

            this.velocity_2.x = elpha.x * deltatime
            this.velocity_2.y = elpha.y * deltatime
            this.velocity_2.z = elpha.z * deltatime
            
            this.teta.x = this.velocity_2.x * deltatime
            this.teta.y = this.velocity_2.y * deltatime  
            this.teta.z = this.velocity_2.z * deltatime
            
            console.log("velocity_2", this.velocity_2)
            console.log("elpha", elpha)
            console.log("teta", this.teta)
            this.position.x += this.velocity.x * deltatime
            this.position.y += this.velocity.y * deltatime
            this.position.z += this.velocity.z * deltatime
            
            

            if(this.massFuel >= this.fuel_rate) {
                 this.massFuel -= this.fuel_rate
                 this.mass -= this.fuel_rate
             }
             console.log("mass", this.mass)
             console.log("massFuel", this.massFuel)
             console.log("massRocket", this.massRocket)
             console.log("fuel_rate", this.fuel_rate)
             

            if(Math.round(this.p0) !==  0){
              this.p0 -=  Math.pow(10,-11) 
             }
            }
            
    
    gravity_force(){
        let Grav_const = 6.673 * Math.pow(10,-11) 
        let m_earth = 5.98 * Math.pow(10,24)
        let d_earth = 6.38 * Math.pow(10,6) + ( this.position.y * 10 )
        let gravity = Grav_const * m_earth / Math.pow(d_earth,2)
    let g_f = new THREE.Vector3(
    0,
    -(this.mass * gravity ) / 100  , // g = 9.8 constant
    0,
    )
    console.log('gravity.x', g_f.x)
    return g_f
    }
      
       powr() {
        let p = new THREE.Vector3(
            (((this.massFuel - this.fuel_rate) / 60 ) * this.fuel_speed + (this.pe - this.p0) * this.Ae) * Math.round(Math.cos(this.th)),
      
            (((this.massFuel - this.fuel_rate) / 60) * this.fuel_speed + (this.pe - this.p0)* this.Ae) * Math.round(Math.sin(this.th)),
       
        0
        )
        console.log("powr.x", p.x)

        return p
        
    }
   
    lift_force(){
        let l_f  = new THREE.Vector3(
 
        -( 0.5 * this.Cl * this.ro * Math.pow(this.velocity.x,2)* this.wingarea ) * Math.round(Math.cos( this.th)) ,

        (0.5*  this.Cl * this.ro *Math.pow(this.velocity.y,2)* this.wingarea) *  Math.round(Math.sin( this.th)),
        0
            // cl is  lift coefficient / ro is air density / A is wing area 
        )
        return l_f
        
    }
    
    drag() {
        let d = new THREE.Vector3(
        - (this.Cd * 0.5 * this.ro * Math.pow(this.velocity.x,2)* this.wingarea) * Math.round(Math.cos( this.th)),
        -(this.Cd * 0.5 * this.ro *  Math.pow(this.velocity.y,2) * this.wingarea) *  Math.round(Math.sin( this.th)),
       
        0
        )
        console.log('drag.x', d)
        return d
    }
   
}
export default Rocket;
