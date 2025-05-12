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

import { create } from 'zustand'

interface RouteState {
  currentRoute: string
}

const useRouteStore = create<RouteState>((set) => {
  const updateRoute = () => set({ currentRoute: window.location.pathname })

  window.addEventListener('popstate', updateRoute)

  return { currentRoute: window.location.pathname }
})

const navigate = (pathname: string) => {
  window.history.pushState({}, '', pathname)
  useRouteStore.setState({ currentRoute: pathname })
}

export { navigate }

export default useRouteStore