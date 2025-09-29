<template>
  <div>
    <h1>Application Electron Vue</h1>
    
    <!--  Navigation-->
    <ul uk-tab>
      <li class="uk-active">
        <router-link to="/">Page One</router-link>
      </li>
      <li>
        <router-link to="/page-2">Page Two</router-link>
      </li>
    </ul>

    <router-view />
  </div>
</template>