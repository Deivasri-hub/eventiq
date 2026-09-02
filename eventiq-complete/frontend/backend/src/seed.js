const fs=require('fs'); const path=require('path'); const {parse}=require('csv-parse/sync'); const bcrypt=require('bcryptjs'); const pool=require('./db');
(async()=>{
 await pool.query(fs.readFileSync(path.join(__dirname,'../schema.sql'),'utf8'));
 const studentPass=await bcrypt.hash('student123',10), orgPass=await bcrypt.hash('organizer123',10);
 const su=await pool.query(`INSERT INTO users(email,password_hash,name,role) VALUES('student@eventiq.demo',$1,'Aishwarya','student') ON CONFLICT(email) DO UPDATE SET password_hash=EXCLUDED.password_hash RETURNING id`,[studentPass]);
 const ou=await pool.query(`INSERT INTO users(email,password_hash,name,role) VALUES('organizer@eventiq.demo',$1,'EventIQ Organizer','organizer') ON CONFLICT(email) DO UPDATE SET password_hash=EXCLUDED.password_hash RETURNING id`,[orgPass]);
 await pool.query(`INSERT INTO student_profiles(user_id,department,year,location,career_goal,experience_level,skills,interests) VALUES($1,'AI & Data Science',2,'Chennai','ML Engineer','Intermediate',ARRAY['Python','Machine Learning','Pandas'],ARRAY['AI','Data Science','Machine Learning']) ON CONFLICT(user_id) DO NOTHING`,[su.rows[0].id]);
 const org=await pool.query(`INSERT INTO organizers(user_id,organization_name,verified) VALUES($1,'EventIQ Demo Organization',true) ON CONFLICT(user_id) DO UPDATE SET organization_name=EXCLUDED.organization_name RETURNING id`,[ou.rows[0].id]);
 const rows=parse(fs.readFileSync(path.join(__dirname,'../events.csv')), {columns:true,skip_empty_lines:true});
 for(const r of rows){
  await pool.query(`INSERT INTO events(event_code,event_name,event_type,category,mode,location,start_date,end_date,start_time,end_time,registration_fee_inr,is_free,organizer_id,organizer_name,required_skills,target_audience,difficulty,status,description)
   VALUES($1,$2,$3,$4,$5,$6,$7,$8,NULLIF($9,''),NULLIF($10,''),$11,$12,$13,$14,$15,$16,$17,$18,$19) ON CONFLICT(event_code) DO NOTHING`,[
    r.event_id,r.event_name,r.event_type,r.category,r.mode,r.location,r.start_date,r.end_date,r.start_time,r.end_time,
    r.registration_fee_inr===''?null:r.registration_fee_inr,r.is_free===''?null:r.is_free==='True',org.rows[0].id,r.organizer||'Event Organizer',
    `{${(r.required_skills||'').split(';').filter(Boolean).map(x=>'"'+x.replaceAll('"','\\"')+'"').join(',')}}`,
    `{${(r.target_audience||'').split(';').filter(Boolean).map(x=>'"'+x.replaceAll('"','\\"')+'"').join(',')}}`,r.difficulty,r.status_as_of_2026_09_01,r.description_short]);
 }
 console.log('Seed complete:',rows.length,'events'); await pool.end();
})().catch(e=>{console.error(e);process.exit(1)});
