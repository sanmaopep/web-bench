// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { makeAutoObservable } from 'mobx'

class RouteStore {
  currentRoute: string = window.location.pathname

  constructor() {
    makeAutoObservable(this)
    window.addEventListener('popstate', this.handleRouteChange)
  }

  handleRouteChange = () => {
    this.currentRoute = window.location.pathname
  }

  navigate = (path: string) => {
    window.history.pushState(null, '', path)
    this.currentRoute = path
  }
}

const routeStore = new RouteStore()
export default routeStore