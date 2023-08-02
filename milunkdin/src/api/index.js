import {
  gql
} from "@apollo/client";

export const getAllReservists = gql`
query getAllReservists {
  reservists {
    experiences {
      company
      end_date
      id
      role
      start_date
    }
    id
    image_url
    linkedin_name
    linkedin_url
    name
    rank
    skills {
      id
      name
      score
    }
    tags {
      id
      name
    }
  }
}
`
export const getAllSkills = gql`
query getSkills {
  skills: skills_aggregate(distinct_on: name) {
    nodes {
      name
      id    
    }
  }
}`

export const getAllTags = gql`
query getTags {
  tags: tags_aggregate(distinct_on: name) {
    nodes {
      id
      name
    }
  }
}
`

export const createReserver = gql`
mutation insert_reserva(
  $linkedinName: String, 
  $linkedinURL: String, 
  $name: String, 
  $rank: String
 ) {
 insert_reservists(
   objects: {
     linkedin_name: $linkedinName, 
     linkedin_url: $linkedinURL,
     name: $name, 
     rank: $rank, 
   }) {
   returning {
     id
   }
 }
}`

export const reservistById = gql`
query getReservistById($id: uuid!) {
  reservist: reservists_by_pk(id: $id) {
    image_url
    linkedin_name
    linkedin_url
    name
    rank
    experiences {
      company
      role
      start_date
      end_date
    }
    skills {
      name
      score
    }
    tags {
      id
      name
    }
    reserves_histories {
      days_num
      description
      id
      rating
      year
      month
    }
    mador {
      mador_id
    }   
  }
}
`

export const addReservesHistory = gql`
mutation insert_reserves_history(
  $days_num: Int, 
  $description: String
  $month: Int, 
  $rating: Int
  $reservist_id: uuid, 
  $year: Int, 
  ) {
      insert_reserves_history(
        objects: {
          days_num: $days_num, 
          description: $description, 
          month: $month, 
          rating: $rating, 
          reservist_id: $reservist_id, 
          year: $year
        }) {
          returning {
            reservist_id
            year
            rating
            month
            id
            description
            days_num
        }
    }
  }`

export const getMyMadorMembers = gql`
query get_my_mador_members {
  mador_members {
    member {
      email
      name
      user_id
    }
  }
}
`

export const getMyMadorManagers = gql`
query get_my_mador_managers($manager_id: String!) {
  mador_managers(where: {manager_id: {_neq: $manager_id}}) {
    mador_id
    mador_manager_user {
      email
      name
      user_id
    }
  }
}
`
export const getMyMadorReservists = gql`
query get_my_mador_reservists {
  mador_reservists {
    reservist {
      experiences {
        company
        end_date
        id
        role
        start_date
      }
      id
      image_url
      linkedin_name
      linkedin_url
      name
      rank
      skills {
        id
        name
        score
      }
      tags {
        id
        name
      }
    }
  }
}
`
export const getAllUsers = gql
`
query get_all_users{
  users(where: {_not: {mador_member: {}}, _and: {_not: {mador_manager: {}}}}) {
    user_id
    name
    email
  }
}
`
export const insertMadorMember = gql
`
mutation inert_mador_member($mador_id: uuid!, $user_id: String!) {
  insert_mador_members(objects: {mador_id: $mador_id, user_id: $user_id}) {
    affected_rows
  }
}

`
export const insertMadorReservist = gql`
mutation insert_mador_reservist($reservist_id: uuid!, $mador_id: uuid!) {
  insert_mador_reservists(objects: {mador_id: $mador_id, reservist_id: $reservist_id}) {
    affected_rows
  }
}
`

export const insertTag = gql`
mutation insert_tag($reservist_id: uuid!, $name: String!) {
  insert_tags(objects: {name: $name, reservist_id: $reservist_id}) {
    affected_rows
  }
}
`

export const insertFavoriteReservist =gql`
mutation insert_favorite_reservist($reservist_id: uuid!, $user_id: String!) {
  insert_favorites_reservists(objects: {reservist_id: $reservist_id, user_id: $user_id}) {
    affected_rows
  }
}
`

export const getFavoriteById = gql`
query get_favorite_by_id($reservist_id: uuid!) {
  favorites_reservists(where: {reservist_id: {_eq: $reservist_id}}) {
    reservist_id
    user_id
  }
}

`

export const getAllMyFavorites = gql`
query get_all_my_favorites {
  favorites_reservists {
    reservist_id
    user_id
    last_entered
    reservist {
      image_url
      linkedin_name
      linkedin_url
      name
      rank
      id
      last_update_date
      experiences {
        company
        role
        start_date
        end_date
      }
      skills {
        name
        score
      }
      tags {
        id
        name
      }
      reserves_histories {
        days_num
        description
        id
        rating
        year
        month
      }
      mador {
        mador_id
      }   
    }
  
  }
}
`

export const deleteFavoriteReservist = gql`
mutation deleteFavoriteReservist($reservist_id: uuid!) {
  delete_favorites_reservists(where: {reservist_id: {_eq: $reservist_id}}) {
    affected_rows
  }
}
`

export const updateLastEnteredFavorite = gql`
mutation updateLastEntered($user_id: String!) {
  update_favorites_reservists(where: {user_id: {_eq: $user_id}}, _set: {last_entered: "now()"}) {
    affected_rows
  }
}
`
export const deleteMadorMembers = gql
`
mutation deleteMadorMember($user_id: String!) {
  delete_mador_members(where: {user_id: {_eq: $user_id}}) {
    affected_rows
  }
}
`

export const deleteMadorReservist = gql
`
mutation deleteMadorReservist($reservist_id: uuid!) {
  delete_mador_reservists(where: {reservist_id: {_eq: $reservist_id}}) {
    affected_rows
  }
}
`

export const countTagsByTag = gql`
query count_tags_agg {
  count_tags_agg {
    tag_count
    tag_name
  }
}
`

export const countSkillsBySkill = gql`
query count_skills_agg {
  count_skills_agg {
    skill_count
    skill_name
  }
}
`

export const countExpsByExp = gql`
query count_exps_agg {
  count_exps_agg {
    exp_count
    exp_name
  }
}
`