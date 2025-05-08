<script lang="ts">
  import { toast } from '../utils/toast';
</script>
  
{#if $toast.message}
  <div 
    class="toast"
    class:visible={$toast.visible}
    style:font-size={$toast.fontSize + 'px'}
  >
    {$toast.message}
  </div>
{/if}

<style>
  .toast {
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%) translateY(-100%);
    background: #4CAF50;
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 12px;
    transition: transform 0.3s ease;
    z-index: 9999;
  }

  .toast.visible {
    transform: translateX(-50%) translateY(0);
  }
</style>